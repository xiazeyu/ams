import * as Keyv from 'keyv';
import KeyvFile from 'keyv-file';

interface IFullKeyPath {
  id: number;
  key: string;
  table: string;
}

class Connection {

  private readonly db: Keyv;

  constructor(fileName: string) {
    this.db = new Keyv({
      'store': new KeyvFile({
        'filename': fileName,
      }),
    });
    this.db.on('error', err => {
      console.log('Connection error', err);
    });
  };

  private genFullKeyPath(key: IFullKeyPath): string {
    return `${key.table}:${key.key}:${key.id}`;
  }

  protected async set(key: IFullKeyPath, value: string): Promise<boolean> {
    return await this.db.set(this.genFullKeyPath(key), value);
  }

  protected async get(key: IFullKeyPath): Promise<string> {
    return await this.db.get(this.genFullKeyPath(key));
  }

  protected async delete(key: IFullKeyPath): Promise<boolean> {
    return await this.db.delete(this.genFullKeyPath(key));
  }

  async clear(flag: boolean): Promise<undefined> {
    return flag ? await this.db.clear() : undefined;
  }

}

export {
  Connection,
}
