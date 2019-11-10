import { Database, IRecord } from './lib/database';

const db = new Database();

type usedTypes = number | IStudent | string | Date | number | number[];
type usedTables = ITable | IStudent | IAbscence | IIndex;

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
  reason: string;
  detailedReason: string;
  dateFrom: Date;
  dateTo: Date;
  week: number[];
  lesson: number[];
}

export interface IIndex {
  stu: number[];
  abs: number[];
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
    Object.keys(val = Object.assign(this.props.reduce((acc, cur) => {
      acc[cur.key] = cur.defaultValue;
      return acc;
    }, {}), val || {})).forEach(key => this[key] = val[key]);
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
  async getInstData(): Promise<IRecord<{}>> {
    return {
      id: this.id,
      table: this.tableName,
      data: await this.props.reduce(async (acc, cur) => {
        acc[cur.key] = await cur.setMethod(this[cur.key]);
        return acc;
      }, {}),
    };
  }
  async insertToDB(): Promise<this> {
    return db.insertRecord(await this.getInstData()).then(() => {
      return this;
    });
  }
  async retriveFromDB(): Promise<this> {
    return db.queryRecord(this.getInstKey()).then(retData => {
      return Promise.all(this.props.map(val => val.getMethod(retData[val.key]))).then(result => {
        result.reduce(((acc, cur, ind) => this[this.props[ind].key] = cur), undefined);
        return this;
      });
    });
  }
  async deleteFromDB(): Promise<this> {
    return db.deleteRecord(this.getInstKey()).then(() => {
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
        { key: 'stu', defaultValue: [], getMethod: async a => JSON.parse(a) as number[], setMethod: async (a: number[]) => JSON.stringify(a) },
        { key: 'abs', defaultValue: [], getMethod: async a => JSON.parse(a) as number[], setMethod: async (a: number[]) => JSON.stringify(a) },
      ],
    }, val);
  }
  async addID(key: string, id: number): Promise<this> {
    await this.retriveFromDB();
    if (this[key] === undefined)
      throw new Error(`${key} does not exist in the index table.`);
    await this.delID(key, id);
    (this[key] as number[]).push(id);
    await this.insertToDB();
    return this;
  }
  async delID(key: string, id: number): Promise<this> {
    await this.retriveFromDB();
    if (this[key] === undefined)
      throw new Error(`${key} does not exist in the index table.`);
    this[key] = (this[key] as number[]).reduce((acc, cur, ind) => {
      return cur === id ? acc.splice(ind, 1) : cur;
    }, this[key] as number[]);
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
        { key: 'name', defaultValue: '', getMethod: async a => JSON.parse(a) as string, setMethod: async (a: string) => JSON.stringify(a) },
        { key: 'phone', defaultValue: 0, getMethod: async a => JSON.parse(a) as number, setMethod: async (a: number) => JSON.stringify(a) },
      ],
    }, val);

  }
}

export class Abscence extends Table implements ITable, IAbscence {
  student: Student;
  reason: string;
  detailedReason: string;
  dateFrom: Date;
  dateTo: Date;
  week: number[];
  lesson: number[];
  constructor(val?: IAbscence | {}) {
    super({
      id: 0,
      tableName: 'abscence',
      props: [
        { key: 'student', defaultValue: new Student(), getMethod: async a => new Student({ id: JSON.parse(a) }).retriveFromDB(), setMethod: async (a: Student) => JSON.stringify(a.id) },
        { key: 'reason', defaultValue: '', getMethod: async a => JSON.parse(a) as string, setMethod: async (a: string) => JSON.stringify(a) },
        { key: 'detailedReason', defaultValue: '', getMethod: async a => JSON.parse(a) as string, setMethod: async (a: string) => JSON.stringify(a) },
        { key: 'dateFrom', defaultValue: new Date(2019, 11, 4), getMethod: async a => new Date(JSON.parse(a)), setMethod: async (a: Date) => JSON.stringify(a.toDateString()) },
        { key: 'dateTo', defaultValue: new Date(2019, 11, 5), getMethod: async a => new Date(JSON.parse(a)), setMethod: async (a: Date) => JSON.stringify(a.toDateString()) },
        { key: 'week', defaultValue: [], getMethod: async a => JSON.parse(a) as number[], setMethod: async (a: number[]) => JSON.stringify(a) },
        { key: 'lesson', defaultValue: [], getMethod: async a => JSON.parse(a) as number[], setMethod: async (a: number[]) => JSON.stringify(a) },
      ],
    }, val);
  }
}
