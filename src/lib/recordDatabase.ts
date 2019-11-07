import { Connection } from './connection';

interface IRecord<T extends string[] | {}> {
  id: number;
  table: string;
  data: T;
}

class Database extends Connection {
  constructor(fileName: string) {
    super(fileName);
  }

  async insertRecord(what: IRecord<{}>): Promise<undefined> {
    return Promise.all(Object.keys(what.data).map(keyName => this.set({
      id: what.id,
      key: keyName,
      table: what.table,
    }, what.data[keyName]))).then(() => {
      return undefined;
    });
  }

  async deleteRecord(what: IRecord<string[]>): Promise<undefined> {
    return Promise.all(what.data.map(keyName => this.delete({
      id: what.id,
      key: keyName,
      table: what.table,
    }))).then(() => {
      return undefined;
    });
  }

  async queryRecord(what: IRecord<string[]>): Promise<IRecord<{}>> {
    return Promise.all(what.data.map(keyName => this.get({
      id: what.id,
      key: keyName,
      table: what.table,
    }))).then(resArr => {
      return {
        id: what.id,
        table: what.table,
        data: resArr.reduce((acc, cur, ind) => {
          acc[what.data[ind]] = cur;
          return acc;
        }, {}),
      };
    });
  }
}

export {
  Database,
  IRecord,
}
