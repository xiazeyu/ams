import * as Keyv from 'keyv';
import KeyvFile from 'keyv-file';

interface FullKeyPath{
  id: Number;
  key: String;
  table: String;
}

class Connection{

  private readonly db: Keyv;

  constructor(fileName: string){
    this.db = new Keyv({
      'store': new KeyvFile({
        'filename': fileName,
      }),
    });
    this.db.on('error', err => {
      console.log('Connection error', err);
    });
  };

  private genFullKeyPath(key: FullKeyPath): String{
    return `${key.table}:${key.key}:${key.id}`;
  }

  async set(key: FullKeyPath, value: string): Promise<Boolean>{
    return await this.db.set(this.genFullKeyPath(key), value);
  }

  async get(key: FullKeyPath): Promise<String>{
    return await this.db.get(this.genFullKeyPath(key));
  }

  async delete(key: FullKeyPath): Promise<Boolean>{
    return await this.db.delete(this.genFullKeyPath(key));
  }

  async clear(flag: boolean): Promise<undefined>{
    return flag ? await this.db.clear() : undefined;
  }

}

export{
  Connection,
}
