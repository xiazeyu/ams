import { Connection } from './connection';

interface IRecord {
  id: Number;
  table: String;
}

interface IRecordKeys extends IRecord {
  data: Array<string>;
}

interface IRecordData extends IRecord {
  data: Object;
}

class Database extends Connection {
  constructor(fileName: string) {
    super(fileName);
  }

  insertRecord(what: IRecordData): Promise<undefined> {
    return Promise.all(Object.keys(what.data).map(keyName => this.set({
      id: what.id,
      key: keyName,
      table: what.table,
    }, what.data[keyName]))).then(() => {
      return undefined;
    });
  }

  deleteRecord(what: IRecordKeys): Promise<undefined> {
    return Promise.all(what.data.map(keyName => this.delete({
      id: what.id,
      key: keyName,
      table: what.table,
    }))).then(() => {
      return undefined;
    });
  }

  queryRecord(what: IRecordKeys): Promise<IRecordData> {
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
  IRecordKeys,
  IRecordData,
}
