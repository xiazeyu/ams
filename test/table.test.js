const fs = require('fs');
const Table = require('../src/table');

describe('Table - layer 3', () => {
  if (fs.existsSync(process.env.DB_ADDRESS)) fs.unlinkSync(process.env.DB_ADDRESS);
  describe('Table - Test()', () => {
    const Test = new Table.Table();
    test('id', () => expect(Test.id).toBe(0));
    test('tableName', () => expect(Test.tableName).toBe('table'));
    test('props', () => expect(Test.props).toStrictEqual([]));
    test('getInstKey()', () => expect(Test.getInstKey()).toStrictEqual({ id: Test.id, table: Test.tableName, data: [] }));
    test('getInstData()', async () => expect(await Test.getInstData()).toStrictEqual({ id: Test.id, table: Test.tableName, data: {} }));
    test('insertToDB()', async () => expect(await Test.insertToDB()).toBeInstanceOf(Table.Table));
    test('retriveFromDB()', async () => expect(await Test.retriveFromDB()).toBeInstanceOf(Table.Table));
    test('deleteFromDB()', async () => expect(await Test.deleteFromDB()).toBeInstanceOf(Table.Table));
  });
});
