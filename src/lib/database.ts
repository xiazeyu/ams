import { Connection } from './connection';

export interface IRecord<T extends string[] | {}> {
  id: number;
  table: string;
  data: T;
}

export class Database extends Connection {
  constructor() {
    super();
  }

  insertRecord(what: IRecord<{}>): Promise<boolean[]> {
    return Promise.all(Object.keys(what.data).map(val => this.set({
      id: what.id,
      key: val,
      table: what.table,
    }, what.data[val])));
  }

  deleteRecord(what: IRecord<string[]>): Promise<boolean[]> {
    return Promise.all(what.data.map(val => this.delete({
      id: what.id,
      key: val,
      table: what.table,
    })));
  }

  async queryRecord(what: IRecord<string[]>): Promise<{}> {
    return (await Promise.all(what.data.map(val => this.get({
      id: what.id,
      key: val,
      table: what.table,
    })))).reduce((acc, cur, ind) => {
      acc[what.data[ind]] = cur;
      return acc;
    }, {});
  }
}
