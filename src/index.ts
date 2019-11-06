import { Database, RecordData, RecordKeys } from './lib/recordDatabase'

const db = new Database('./storedb.json');

interface IRecordKey {
  key: string;
  getMethod: Function;
  setMethod: Function;
}

interface ITable {
  id: Number;
  tableName: string;
  props: Array<IRecordKey>;
}

interface IStudent extends ITable {
  name: string;
}

interface IReason extends ITable {
  name: String;
}

interface IAbscence extends ITable {
  student: Student;
  reason: Reason;
  dateFrom: Date;
  dateTo: Date;
  week?: Number;
  lesson: Array<Number>;
}

interface IIndex extends ITable {
  stuIDs: Array<Number>;
  reaIDs: Array<Number>;
  absIDs: Array<Number>;
  odaIDs: Array<Number>;
}

class Table implements ITable {
  public id: Number;
  public tableName: string;
  public props: Array<IRecordKey>;
  constructor(val: ITable = { id: 0, tableName: 'table', props: [] }) {
    this.id = val.id;
    this.tableName = val.tableName;
    this.props = [];
  }
  public getInstData() {
    return this.props.reduce((acc, cur) => {
      acc[cur.key] = cur.setMethod(this[cur.key]);
      return acc;
    }, {});
  }
  public genInstData(): RecordData {
    return {
      id: this.id,
      table: this.tableName,
      data: this.getInstData(),
    };
  }
  public genKeys(): RecordKeys {
    const keysArr = Object.keys(this.getInstData());
    return Object.assign(this.genInstData(), { data: keysArr });
  }
  public showInfo(): undefined {
    console.log(this.props.map((propName) => {
      return { k: propName, v: this[propName.key] };
    }));
    return undefined;
  }
  public insertToDB(): Promise<undefined> {
    return db.insertRecord(this.genInstData());
  }
  public retriveFromDB(): Promise<undefined> {
    return db.queryRecord(this.genKeys()).then((result) => {
      this.props.forEach((val) => {
        this[val.key] = val.getMethod(result.data[val.key]);
      });
      return undefined;
    });
  }
  public deleteFromDB(): Promise<undefined> {
    return db.deleteRecord(this.genKeys());
  }
}

class Index extends Table {
  constructor(prop: IIndex = { id: 0, tableName: 'index', stuIDs: [], reaIDs: [], absIDs: [], odaIDs: [] }) {
    super(prop);
  }
}

const index = new Index();

class Student extends Table {
  constructor(prop: IStudent = { id: 0, tableName: 'student', name: '' }) {
    super(prop);
  }
}

class Reason extends Table {
  constructor(prop: IReason = { id: 0, tableName: 'reason', name: '' }) {
    super(prop);
  }
}

class Abscence extends Table {
  constructor(prop: IAbscence = { id: 0, tableName: 'abscence', student: new Student(), reason: new Reason(), dateFrom: new Date(2019, 11, 4), dateTo: new Date(2019, 11, 5), lesson: [0] }) {
    super(prop);
  }
}

async function initReason() {
  const defaultReason = [
    { id: 0, name: '请假' },
    { id: 1, name: '雅思课程' },
    { id: 2, name: '党课' },
    { id: 3, name: '篮球队集训' },
  ]
  return Promise.all(defaultReason.map(async (v) => {
    const r = new Reason();
    r.id = v.id;
    await r.retriveFromDB();
    if (!(r.name === v.name)) {
      r.name = v.name;
      await r.insertToDB();
      return true;
    }
    return false;
  })).then((r) => {
    console.log(r);
    return undefined;
  });
}

async function playground() {
}

initReason();
playground();
