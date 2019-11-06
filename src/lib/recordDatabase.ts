import { Connection } from './connection';

interface Record {
  id: Number;
  table: String;
}

interface RecordKeys extends Record {
  data: Array<string>;
}

interface RecordData extends Record {
  data: Object;
}

class Database extends Connection {
  constructor(fileName: string) {
    super(fileName);
  }

  insertRecord(what: RecordData): Promise<undefined> {
    return Promise.all(Object.keys(what.data).map(keyName => this.set({
      id: what.id,
      key: keyName,
      table: what.table,
    }, what.data[keyName]))).then(() => {
      return undefined;
    });
  }

  deleteRecord(what: RecordKeys): Promise<undefined> {
    return Promise.all(what.data.map(keyName => this.delete({
      id: what.id,
      key: keyName,
      table: what.table,
    }))).then(() => {
      return undefined;
    });
  }

  queryRecord(what: RecordKeys): Promise<RecordData> {
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
  RecordKeys,
  RecordData,
}
