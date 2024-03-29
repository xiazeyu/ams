import { Database, IRecord } from './lib/database';

export const db = new Database();

type usedTypes = number | IStudent | string | Date | number | number[];
type usedTables = ITable | IStudent | IAbscence | IIndex;
export type weekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type lesson = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type stuStatus = '到场' | '迟到' | '早退' | '未到' | '事假' | '病假';
export const statusArr: stuStatus[] = ['到场', '迟到', '早退', '未到', '事假', '病假'];
export const weekDayArr = [
  { name: 'Sunday(0)', value: 0 },
  { name: 'Monday(1)', value: 1 },
  { name: 'Tuesday(2)', value: 2 },
  { name: 'Wednesday(3)', value: 3 },
  { name: 'Thursday(4)', value: 4 },
  { name: 'Friday(5)', value: 5 },
  { name: 'Saturday(6)', value: 6 },
];
export const lessonArr = [
  { name: '1(08.30-09.15)', value: 1 },
  { name: '2(09.20-10.05)', value: 2 },
  { name: '3(10.25-11.10)', value: 3 },
  { name: '4(11.15-12.00)', value: 4 },
  { name: '5(13.30-14.15)', value: 5 },
  { name: '6(14.20-15.05)', value: 6 },
  { name: '7(15.25-16.10)', value: 7 },
  { name: '8(16.15-17.00)', value: 8 },
  { name: '9(17.05-17.50)', value: 9 },
  { name: '10(18.30-19.15)(nighty self-study)', value: 10 },
  { name: '11(19.20-20.05)', value: 11 },
  { name: '12(20.10-20.55)', value: 12 },
];

interface IRecordKey<T extends usedTypes> {
  key: string;
  defaultValue: T;
  getMethod: (val: string) => Promise<T>;
  setMethod: (val: T) => Promise<string>;
}

export interface ITable extends Object {
  id: number;
  tableName: string;
  props: IRecordKey<usedTypes>[];
}

export interface IStudent {
  id: number;
  name: string;
  phone?: number;
}

export interface IAbscence {
  id: number;
  student: IStudent;
  reason: stuStatus;
  detailedReason: string;
  dateFrom: Date;
  dateTo: Date;
  weekDays: weekDay[];
  lessons: lesson[];
}

export interface IIndex {
  stu: number[];
  abs: number[];
}

export interface IStuStatus extends IStudent {
  status: stuStatus;
  detailedReason?: string;
}

export class Table implements ITable {
  id: number;
  tableName: string;
  props: IRecordKey<usedTypes>[];
  constructor(table?: ITable, val?: usedTables | {}) {
    Object.keys(table = Object.assign({
      id: 0,
      tableName: 'table',
      props: [],
    }, table || {})).forEach(key => this[key] = table[key]);
    Object.keys(val = Object.assign(this.props.reduce((acc, cur) => (acc[cur.key] = cur.defaultValue, acc), {}), val || {}))
      .forEach(key => this[key] = val[key]);
  }
  getInstKey(): string[] {
    return this.props.reduce((acc, cur) => (acc.push(cur.key), acc), []);
  }
  async getInstData(): Promise<{}> {
    return Promise.all(this.props.map(val => val.setMethod(this[val.key])))
      .then(res => res.reduce((acc, cur, ind) => (acc[this.getInstKey()[ind]] = cur, acc), {}));
  }
  async insertToDB(): Promise<this> {
    return db.insertRecord({
      id: this.id,
      table: this.tableName,
      data: await this.getInstData(),
    }).then(() => {
      return this;
    });
  }
  async retriveFromDB(): Promise<this> {
    return db.queryRecord({
      id: this.id,
      table: this.tableName,
      data: this.getInstKey(),
    }).then(retData => {
      return Promise.all(this.props.map(val => val.getMethod(retData[val.key]))).then(result => {
        result.reduce(((acc, cur, ind) => this[this.props[ind].key] = cur), undefined);
        return this;
      });
    });
  }
  async deleteFromDB(): Promise<this> {
    return db.deleteRecord({
      id: this.id,
      table: this.tableName,
      data: this.getInstKey(),
    }).then(() => {
      return this;
    });
  }
}

class Index extends Table implements ITable, IIndex {
  stu: number[];
  abs: number[];
  constructor(val?: IIndex | {}) {
    super({
      id: 0,
      tableName: 'index',
      props: [
        { key: 'stu', defaultValue: [], getMethod: async a => JSON.parse(a || '[]') as number[], setMethod: async (a: number[]) => JSON.stringify(a) },
        { key: 'abs', defaultValue: [], getMethod: async a => JSON.parse(a || '[]') as number[], setMethod: async (a: number[]) => JSON.stringify(a) },
      ],
    }, val);
  }
  async addID(key: string, id: number): Promise<this> {
    if (this[key] === undefined)
      throw new Error(`${key} does not exist in the index table.`);
    await this.retriveFromDB();

    await this.delID(key, id);
    (this[key] as number[]).push(id);

    await this.insertToDB();
    return this;
  }
  async delID(key: string, id: number): Promise<this> {
    if (this[key] === undefined)
      throw new Error(`${key} does not exist in the index table.`);
    await this.retriveFromDB();

    this[key] = (this[key] as number[]).reduce((acc, cur) => {
      return cur === id ? acc : acc.push(cur), acc;
    }, []);

    await this.insertToDB();
    return this;
  }
}

export const index = new Index();

export class Student extends Table implements ITable, IStudent {
  name: string;
  phone?: number;
  constructor(val?: IStudent | {}) {
    super({
      id: 0,
      tableName: 'student',
      props: [
        { key: 'name', defaultValue: '', getMethod: async a => JSON.parse(a || '"NOTFOUND"') as string, setMethod: async (a: string) => JSON.stringify(a) },
        { key: 'phone', defaultValue: 0, getMethod: async a => JSON.parse(a || '0') as number, setMethod: async (a: number) => JSON.stringify(a) },
      ],
    }, val);
  }
  async insertToDB(): Promise<this> {
    await index.addID('stu', this.id);
    return super.insertToDB();
  }
  async deleteFromDB(): Promise<this> {
    await index.delID('stu', this.id);
    return super.deleteFromDB();
  }
  async getByName(name: string): Promise<this> {
    return Promise.all(index.stu.map(async (val) => {
      const t = new Student();
      t.id = val;
      await t.retriveFromDB();
      return t;
    })).then(async (resArr) => {
      this.id = resArr.reduce((acc, cur) => {
        if (cur.name === name) return cur.id;
        return acc;
      }, 0);
      await this.retriveFromDB();
      return this;
    });
  }
}

export class Abscence extends Table implements ITable, IAbscence {
  student: Student;
  reason: stuStatus;
  detailedReason: string;
  dateFrom: Date;
  dateTo: Date;
  weekDays: weekDay[];
  lessons: lesson[];
  constructor(val?: IAbscence | {}) {
    super({
      id: 0,
      tableName: 'abscence',
      props: [
        { key: 'student', defaultValue: new Student(), getMethod: async a => new Student({ id: JSON.parse(a || '0') }).retriveFromDB(), setMethod: async (a: Student) => JSON.stringify(a.id) },
        { key: 'reason', defaultValue: '', getMethod: async a => JSON.parse(a || '"NOTFOUND"') as string, setMethod: async (a: string) => JSON.stringify(a) },
        { key: 'detailedReason', defaultValue: '', getMethod: async a => JSON.parse(a || '"NOTFOUND"') as string, setMethod: async (a: string) => JSON.stringify(a) },
        { key: 'dateFrom', defaultValue: new Date(2019, 10, 4), getMethod: async a => new Date(JSON.parse(a || '"Mon Nov 04 2019"')), setMethod: async (a: Date) => JSON.stringify(a.toDateString()) },
        { key: 'dateTo', defaultValue: new Date(2019, 10, 5), getMethod: async a => new Date(JSON.parse(a || '"Tue Nov 05 2019"')), setMethod: async (a: Date) => JSON.stringify(a.toDateString()) },
        { key: 'weekDays', defaultValue: [], getMethod: async a => JSON.parse(a || '[]') as weekDay[], setMethod: async (a: weekDay[]) => JSON.stringify(a) },
        { key: 'lessons', defaultValue: [], getMethod: async a => JSON.parse(a || '[]') as lesson[], setMethod: async (a: lesson[]) => JSON.stringify(a) },
      ],
    }, val);
  }
  async insertToDB(): Promise<this> {
    await index.addID('abs', this.id);
    return super.insertToDB();
  }
  async retriveFromDB(): Promise<this> {
    await this.student.retriveFromDB();
    return super.retriveFromDB();
  }
  async deleteFromDB(): Promise<this> {
    await index.delID('abs', this.id);
    return super.deleteFromDB();
  }
  isActive(time: Date, lesson: lesson): boolean {
    if (this.lessons.length && !this.lessons.includes(lesson))
      return false;
    if ((this.dateFrom <= time) && (this.dateTo >= time)) {
      if (this.weekDays.length)
        return this.weekDays.includes(time.getDay() as weekDay);
      return true;
    }
    return false;
  }
}
