import { Database, RecordData, RecordKeys } from './lib/recordDatabase'

class Student {
  constructor(public stuID: Number = 0, public name: String = '') {

  }
  showInfo(): undefined {
    console.log(`stuID: ${this.stuID}, name: ${this.name}`);
    return;
  }
  private genRecordData(): RecordData {
    return {
      id: this.stuID,
      table: 'student',
      data: {
        name: this.name,
      },
    };
  }
  private genRecordKey(): RecordKeys {
    const dataKeys = Object.keys(this.genRecordData().data);
    return Object.assign(this.genRecordData(), { data: dataKeys });
  }
  insertToDB(DB: Database): Promise<undefined> {
    return DB.insertRecord(this.genRecordData());
  }
  retriveFromDB(DB: Database): Promise<undefined> {
    return DB.queryRecord(this.genRecordKey()).then((result) => {
      this.genRecordKey().data.forEach((keyName) => {
        this[keyName] = result.data[keyName];
      });
      return undefined;
    });
  }
  deleteFromDB(DB: Database): Promise<undefined> {
    return DB.deleteRecord(this.genRecordKey());
  }
}

class Reason {
  constructor(public reaID: Number = 0, public name: String = '') {

  }
  showInfo(): undefined {
    console.log(`reaID: ${this.reaID}, name: ${this.name}`);
    return;
  }
  private genRecordData(): RecordData {
    return {
      id: this.reaID,
      table: 'reason',
      data: {
        name: this.name,
      },
    };
  }
  private genRecordKey(): RecordKeys {
    const dataKeys = Object.keys(this.genRecordData().data);
    return Object.assign(this.genRecordData(), { data: dataKeys });
  }
  insertToDB(DB: Database): Promise<undefined> {
    return DB.insertRecord(this.genRecordData());
  }
  retriveFromDB(DB: Database): Promise<undefined> {
    return DB.queryRecord(this.genRecordKey()).then((result) => {
      this.genRecordKey().data.forEach((keyName) => {
        this[keyName] = result.data[keyName];
      });
      return undefined;
    });
  }
  deleteFromDB(DB: Database): Promise<undefined> {
    return DB.deleteRecord(this.genRecordKey());
  }
}

class Abscence {
  constructor(public absID: Number, public student: Student, public reason: Reason, public dateFrom: Date, public dateTo: Date, public lesson: Array<Number>) {

  }
  showInfo(): undefined {
    console.log(`absID: ${this.absID}, stuName&ID: ${this.student.name}${this.student.stuID}, rea: ${this.reason.name}, date: ${this.dateFrom}`);
    return;
  }
  private genRecordData(): RecordData {
    return {
      id: this.absID,
      table: 'abscence',
      data: {
      },
    };
  }
  private genRecordKey(): RecordKeys {
    const dataKeys = Object.keys(this.genRecordData().data);
    return Object.assign(this.genRecordData(), { data: dataKeys });
  }
  insertToDB(DB: Database): Promise<undefined> {
    return DB.insertRecord(this.genRecordData());
  }
  retriveFromDB(DB: Database): Promise<undefined> {
    return DB.queryRecord(this.genRecordKey()).then((result) => {
      this.genRecordKey().data.forEach((keyName) => {
        this[keyName] = result.data[keyName];
      });
      return undefined;
    });
  }
  deleteFromDB(DB: Database): Promise<undefined> {
    return DB.deleteRecord(this.genRecordKey());
  }
}

class Index {
  constructor(public db: Database, public stuIDs: Array<Number> = [], reaIDs: Array<Number> = [], absIDs: Array<Number> = [], odaIDs: Array<Number> = []) {

  }
}


const currDB = new Database('./storedb.json');
const currIndex = new Index(currDB);

async function initReason() {
  const defaultReason = [
    { reaID: 0, name: '请假' },
    { reaID: 1, name: '雅思课程' },
    { reaID: 2, name: '党课' },
    { reaID: 3, name: '篮球队集训' },
  ]
  return Promise.all(defaultReason.map(async (v) => {
    const r = new Reason();
    r.reaID = v.reaID;
    await r.retriveFromDB(currDB);
    if(!(r.name === v.name)){
      r.name = v.name;
      await r.insertToDB(currDB);
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
