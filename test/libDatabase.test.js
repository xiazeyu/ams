const fs = require('fs');
const Database = require('../src/lib/database');

function getRecordArr(o) {
  return Object.assign({}, o, { data: Object.keys(o.data) });
}

describe('Database - layer 2', () => {
  if (fs.existsSync(process.env.DB_ADDRESS)) fs.unlinkSync(process.env.DB_ADDRESS);
  const db = new Database.Database();
  const testdata = {
    key1: 'val1',
    key2: 'val2',
  };
  const recordObj1 = {
    id: '0',
    table: 'table1',
    data: testdata,
  };

  test('recordArr', () => {
    expect(getRecordArr(recordObj1)).toStrictEqual({
      id: '0',
      table: 'table1',
      data: ['key1', 'key2'],
    });
    expect(recordObj1).toStrictEqual({
      id: '0',
      table: 'table1',
      data: testdata,
    });
  });

  describe('record1: insert, query', () => {
    test('insert record1(val1, val2)', async () => {
      expect(await db.insertRecord(recordObj1)).toStrictEqual([true, true]);
    });
    test('query record1(val1, val2)', async () => {
      expect(await db.queryRecord(getRecordArr(recordObj1))).toStrictEqual(testdata);
    });
  });

  describe('record2: insert, query, delete, query', () => {
    const recordObj = {
      id: '1',
      table: 'table1',
      data: testdata,
    };
    test('insert record2(val1, val2)', async () => {
      expect(await db.insertRecord(recordObj)).toStrictEqual([true, true]);
    });
    test('query record2(val1, val2)', async () => {
      expect(await db.queryRecord(getRecordArr(recordObj))).toStrictEqual(testdata);
    });
    test('delete record2', async () => {
      expect(await db.deleteRecord(getRecordArr(recordObj))).toStrictEqual([true, true]);
    });
    test('query record2(undefined, undefined)', async () => {
      expect(await db.queryRecord(getRecordArr(recordObj))).toStrictEqual({ key1: undefined, key2: undefined });
    });
  });

  describe('record3: insert, query, insert, query', () => {
    const recordObj = {
      id: '0',
      table: 'table2',
      data: testdata,
    };
    test('insert record3(val1, val2)', async () => {
      expect(await db.insertRecord(recordObj)).toStrictEqual([true, true]);
    });
    test('query record3(val1, val2)', async () => {
      expect(await db.queryRecord(getRecordArr(recordObj))).toStrictEqual(testdata);
    });
    const testdata2 = {
      key1: 'val3',
      key2: 'val4',
    };
    test('insert record2(val3, val4)', async () => {
      expect(await db.insertRecord(Object.assign({}, recordObj, { data: testdata2 }))).toStrictEqual([true, true]);
    });
    test('query record2(val3, val4)', async () => {
      expect(await db.queryRecord(getRecordArr(recordObj))).toStrictEqual(testdata2);
    });
  });

  describe('record4: delete, query', () => {
    const recordObj = {
      id: '1',
      table: 'table2',
      data: testdata,
    };
    test('delete record4', async () => {
      expect(await db.deleteRecord(getRecordArr(recordObj))).toStrictEqual([false, false]);
    });
    test('query record4(undefined, undefined)', async () => {
      expect(await db.queryRecord(getRecordArr(recordObj))).toStrictEqual({ key1: undefined, key2: undefined });
    });
  });

  describe('record1: clear(false), query, clear(true), query', () => {
    test('clear(false)', async () => {
      expect(await db.clear(false)).toBeUndefined();
    });
    test('query record1(val1, val2)', async () => {
      expect(await db.queryRecord(getRecordArr(recordObj1))).toStrictEqual(testdata);
    });
    test('clear(true)', async () => {
      expect(await db.clear(true)).toBeUndefined();
    });
    test('query record1(undefined, undefined)', async () => {
      expect(await db.queryRecord(getRecordArr(recordObj1))).toStrictEqual({ key1: undefined, key2: undefined });
    });
  });
});
