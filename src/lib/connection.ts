import * as Keyv from 'keyv';
import KeyvFile from 'keyv-file';

interface actualKeyName{
  id: number;
  key: string;
  table: string;
};

class Database{

  private readonly db: Keyv;

  constructor(public fileName: string){
    this.db = new Keyv({
      'store': new KeyvFile({
        'filename': fileName,
      }),
    });
    this.db.on('error', err => {
      console.log('Connection error', err);
    });
  };

  private genFullKeyName(key: actualKeyName){
    return `${key.table}:${key.key}:${key.id}`;
  }

  async set(key: actualKeyName, value: string){
    return await this.db.set(this.genFullKeyName(key), value);
  }

  async get(key: actualKeyName){
    return await this.db.get(this.genFullKeyName(key));
  }

  async delete(key: actualKeyName){
    return await this.db.delete(this.genFullKeyName(key));
  }

  async clear(flag: boolean){
    return flag ? await this.db.clear() : undefined;
  }

}

const currDB = new Database('./store.db');

export = currDB;
