import {Connection} from './connection';

interface Record{
  id: Number;
  table: String;
}

interface RecordKeys extends Record{
  data: Array<string>;
}

interface RecordData extends Record{
  data: Object;
}

class Database extends Connection{
  constructor(fileName: string){
    super(fileName);
  }

  insertRecord(what: RecordData): Promise<Array<Boolean>>{
    return Promise.all(Object.keys(what.data).map(keyName => this.set({
      id: what.id,
      key: keyName,
      table: what.table,
    }, what.data[keyName])));
  }

  deleteRecord(what: RecordKeys): Promise<Array<Boolean>>{
    return Promise.all(what.data.map(keyName => this.delete({
      id: what.id,
      key: keyName,
      table: what.table
    })));
  }

  queryRecord(what: RecordKeys): Promise<RecordData>{

    return Promise.all(what.data.map(keyName => this.get({
      id: what.id,
      key: keyName,
      table: what.table,
    }))).then(resArr => {
      const data = {};
      resArr.reduce((prev, curr, index) => {
        return data[what.data[index]] = curr;
      });
      return {
        id: what.id,
        table: what.table,
        data: data,
      };
    });
  }
}

export{
  Database,
}
