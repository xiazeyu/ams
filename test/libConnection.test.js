const Connection = require('../src/lib/connection');

describe('Connection - layer 1', () => {
  const db = new Connection.Connection();
  const key1 = {
    id: '0',
    key: 'key1',
    table: 'table1',
  };
  describe('errors', () => {
    test('db.emit("error")', () => {
      expect(() => {
        db.db.emit('error', 'test');
      }).toThrowError('test');
    });
    test('no DB_ADDRESS', () => {
      jest.resetModules();
      const oldDBPath = process.env.DB_ADDRESS;
      delete process.env.DB_ADDRESS;
      expect(() => {
        new Connection.Connection();
      }).toThrowError(`Connection expect a DB_ADDRESS, got undefined, check process.env.DB_ADDRESS.`);
      process.env.DB_ADDRESS = oldDBPath;
    });
  });
  describe('record1: set, get', () => {
    test('set key1 = 1', async () => {
      expect(await db.set(key1, 1)).toBe(true);
    });
    test('get key1(1)', async () => {
      expect(await db.get(key1)).toBe(1);
    });
  });

  describe('record2: set, get, delete, get', () => {
    const key = {
      id: '1',
      key: 'key1',
      table: 'table1',
    };
    test('set key = 2', async () => {
      expect(await db.set(key, 2)).toBe(true);
    });
    test('get key(2)', async () => {
      expect(await db.get(key)).toBe(2);
    });
    test('delete key', async () => {
      expect(await db.delete(key)).toBe(true);
    });
    test('get key(undefined)', async () => {
      expect(await db.get(key)).toBeUndefined();
    });
  });

  describe('record3: set, get, set, get', () => {
    const key = {
      id: '0',
      key: 'key2',
      table: 'table1',
    };
    test('set key = 3', async () => {
      expect(await db.set(key, 3)).toBe(true);
    });
    test('get key(3)', async () => {
      expect(await db.get(key)).toBe(3);
    });
    test('set key = 4', async () => {
      expect(await db.set(key, 4)).toBe(true);
    });
    test('get key(4)', async () => {
      expect(await db.get(key)).toBe(4);
    });
  });

  describe('record4: get', () => {
    const key = {
      id: '0',
      key: 'key3',
      table: 'table2',
    };
    test('get key(undefined)', async () => {
      expect(await db.get(key)).toBeUndefined();
    });
  });

  describe('record1: clear(false), get, clear(true), get', () => {
    test('clear(false)', async () => {
      expect(await db.clear(false)).toBeUndefined();
    });
    test('get key1(1)', async () => {
      expect(await db.get(key1)).toBe(1);
    });
    test('clear(true)', async () => {
      expect(await db.clear(true)).toBeUndefined();
    });
    test('get key1(undefined)', async () => {
      expect(await db.get(key1)).toBeUndefined();
    });
  });
});
