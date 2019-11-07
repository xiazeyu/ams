import { Database, IRecord } from './lib/recordDatabase'

const db = new Database('data/storedb.json');

type usedTypes = number|string|IStudent|IReason|Date|number[];

interface IRecordKey {
  key: string;
  getMethod: (val: string) => Promise<usedTypes>;
  setMethod: (val: usedTypes) => Promise<string>;
}

interface ITable {
  id: number;
  tableName: string;
  props: IRecordKey[];
}

interface IStudent {
  id: number;
  name: string;
  phone?: number;
}

interface IReason {
  id: number;
  name: string;
}

interface IAbscence {
  id: number;
  student: IStudent;
  reason: IReason;
  dateFrom: Date;
  dateTo: Date;
  week: number[];
  lesson: number[];
}

interface IIndex {
  stuIDs: number[];
  reaIDs: number[];
  absIDs: number[];
}

class Table implements ITable {
  id: number;
  tableName: string;
  props: IRecordKey[];
  constructor(val?: ITable) {
    val = Object.assign(val || {}, {
      id: 0,
      tableName: 'table',
      props: [],
    });
    Object.keys(val).forEach(key => this[key] = val[key]);
  }
  getInstKey(): IRecord<string[]> {
    return {
      id: this.id,
      table: this.tableName,
      data: this.props.reduce((acc, cur) => {
        acc.push(cur);
        return acc;
      }, []),
    }
  }
  async genInstData(): Promise<{}> {
    return this.props.reduce(async (acc, cur) => {
      acc[cur.key] = await cur.setMethod(this[cur.key]);
      return acc;
    }, {});
  }
  async getInstData(): Promise<IRecord<{}>> {
    return {
      id: this.id,
      table: this.tableName,
      data: await this.genInstData(),
    };
  }
  showInfo(): undefined {
    console.log(this.props.map((propName) => {
      return { k: propName, v: this[propName.key] };
    }));
    return undefined;
  }
  async insertToDB(): Promise<undefined> {
    return await db.insertRecord(await this.getInstData());
  }
  async retriveFromDB(): Promise<this> {
    return await db.queryRecord(await this.getInstKey()).then(async (retData) => {
      return await Promise.all(this.props.map(val => val.getMethod(retData.data[val.key]))).then(async result => {
        result.reduce(((acc, cur, ind) => this[this.props[ind].key] = cur), undefined);
        return this;
      });
    });
  }
  async deleteFromDB(): Promise<this> {
    return await db.deleteRecord(await this.getInstKey()).then(() => {
      return this;
    });
  }
}

class Index extends Table implements ITable, IIndex {
  stuIDs: number[];
  reaIDs: number[];
  absIDs: number[];
  constructor(val?: IIndex | {}) {
    super({
      id: 0,
      tableName: 'index',
      props: [
        { key: 'stuIDs', getMethod: async a => JSON.parse(a) as number[], setMethod: async (a: number[]) => JSON.stringify(a) },
        { key: 'reaIDs', getMethod: async a => JSON.parse(a) as number[], setMethod: async (a: number[]) => JSON.stringify(a) },
        { key: 'absIDs', getMethod: async a => JSON.parse(a) as number[], setMethod: async (a: number[]) => JSON.stringify(a) },
      ],
    });
    val = Object.assign(val || {}, {
      stuIDs: [],
      reaIDs: [],
      absIDs: [],
    });
    Object.keys(val).forEach(key => this[key] = val[key]);
  }
}

const index = new Index();

class Student extends Table implements ITable, IStudent {
  name: string;
  phone?: number;
  constructor(val?: IStudent|{}) {
    super({
      id: 0,
      tableName: 'student',
      props: [
        { key: 'name', getMethod: async a => JSON.parse(a) as string, setMethod: async (a: string) => JSON.stringify(a) },
        { key: 'phone', getMethod: async a => JSON.parse(a) as number, setMethod: async (a: number) => JSON.stringify(a) },
      ],
    });
    val = Object.assign(val || {}, {
      name: '',
      phone: 0,
    });
    Object.keys(val).forEach(key => this[key] = val[key]);
  }
  async insertToDB(): Promise<undefined>{
    index.stuIDs.push(this.id);
    await index.insertToDB();
    return super.insertToDB();
  }
  async deleteFromDB(): Promise<this>{
    index.stuIDs.forEach((cur, ind) => {
      if(cur === this.id)
        index.stuIDs[ind] = undefined;
    });
    await index.insertToDB();
    return super.deleteFromDB();
  }
}

class Reason extends Table implements ITable, IReason {
  name: string;
  constructor(val?: IReason | {}) {
    super({
      id: 0,
      tableName: 'reason',
      props: [
        { key: 'name', getMethod: async a => JSON.parse(a) as string, setMethod: async (a: string) => JSON.stringify(a) },
      ],
    });
    val = Object.assign(val || {}, {
      name: '',
    });
    Object.keys(val).forEach(key => this[key] = val[key]);
  }
  async insertToDB(): Promise<undefined>{
    index.reaIDs.push(this.id);
    await index.insertToDB();
    return super.insertToDB();
  }
  async deleteFromDB(): Promise<this>{
    index.reaIDs.forEach((cur, ind) => {
      if(cur === this.id)
        index.reaIDs[ind] = undefined;
    });
    await index.insertToDB();
    return super.deleteFromDB();
  }
}

class Abscence extends Table implements ITable, IAbscence {
  student: Student;
  reason: Reason;
  dateFrom: Date;
  dateTo: Date;
  week: number[];
  lesson: number[];
  constructor(val?: IAbscence | {}) {
    super({
      id: 0,
      tableName: 'abscence',
      props: [
        { key: 'student', getMethod: async a => new Student({ id: JSON.parse(a) }).retriveFromDB(), setMethod: async (a: Student) => JSON.stringify(a.id) },
        { key: 'reason', getMethod: async a => new Reason({ id: JSON.parse(a) }).retriveFromDB(), setMethod: async (a: Reason) => JSON.stringify(a.id) },
        { key: 'dateFrom', getMethod: async a => new Date(JSON.parse(a)), setMethod: async (a: Date) => JSON.stringify(a.toDateString()) },
        { key: 'dateTo', getMethod: async a => new Date(JSON.parse(a)), setMethod: async (a: Date) => JSON.stringify(a.toDateString()) },
        { key: 'week', getMethod: async a => JSON.parse(a) as number, setMethod: async (a: number) => JSON.stringify(a) },
        { key: 'lesson', getMethod: async a => JSON.parse(a) as number[], setMethod: async (a: number[]) => JSON.stringify(a) },
      ],
    });
    val = Object.assign(val || {}, {
      student: new Student(),
      reason: new Reason(),
      dateFrom: new Date(2019, 11, 4),
      dateTo: new Date(2019, 11, 5),
      week: 0,
      lesson: [0],
    });
    Object.keys(val).forEach(key => this[key] = val[key]);
  }
  async insertToDB(): Promise<undefined>{
    index.absIDs.push(this.id);
    await index.insertToDB();
    return super.insertToDB();
  }
  async deleteFromDB(): Promise<this>{
    index.absIDs.forEach((cur, ind) => {
      if(cur === this.id)
        index.absIDs[ind] = undefined;
    });
    await index.insertToDB();
    return super.deleteFromDB();
  }
}

export {
  db,
  index,
  Student,
  Reason,
  Abscence,
}
