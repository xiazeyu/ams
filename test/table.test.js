const Table = require('../src/table');

describe('Table - layer 3', () => {
  describe('Table(basicTest)', () => {
    const Test = new Table.Table();
    test('id', () => expect(Test.id).toBe(0));
    test('tableName', () => expect(Test.tableName).toBe('table'));
    test('props', () => expect(Test.props).toStrictEqual([]));
    test('getInstKey()', () => expect(Test.getInstKey()).toStrictEqual([]));
    test('getInstData()', async () => expect(await Test.getInstData()).toStrictEqual({}));
    test('insertToDB()', async () => expect(await Test.insertToDB()).toBeInstanceOf(Table.Table));
    test('retriveFromDB()', async () => expect(await Test.retriveFromDB()).toBeInstanceOf(Table.Table));
    test('deleteFromDB()', async () => expect(await Test.deleteFromDB()).toBeInstanceOf(Table.Table));
  });
  describe('Table(fullTest)', () => {
    const p1 = {
      id: 1,
      tableName: 'testTable',
      props: [
        { key: 'testStr1', defaultValue: 'str1', getMethod: async a => JSON.parse(a), setMethod: async a => JSON.stringify(a) },
        { key: 'testDate1', defaultValue: new Date(2019, 11, 4), getMethod: async a => new Date(JSON.parse(a)), setMethod: async a => JSON.stringify(a.toDateString()) },
        { key: 'testArr1', defaultValue: [1, 2], getMethod: async a => JSON.parse(a), setMethod: async a => JSON.stringify(a) },
        { key: 'testStr2', defaultValue: 'str2', getMethod: async a => JSON.parse(a), setMethod: async a => JSON.stringify(a) },
        { key: 'testDate2', defaultValue: new Date(2019, 11, 5), getMethod: async a => new Date(JSON.parse(a)), setMethod: async a => JSON.stringify(a.toDateString()) },
        { key: 'testArr2', defaultValue: [3, 4], getMethod: async a => JSON.parse(a), setMethod: async a => JSON.stringify(a) },
      ],
    };
    const p2 = {
      testStr2: 'str3',
      testDate2: new Date(2019, 11, 10),
      testArr2: [5, 6],
    };
    const tProps = ['testStr1', 'testDate1', 'testArr1', 'testStr2', 'testDate2', 'testArr2'];
    const tDatas = {
      testStr1: 'str1',
      testDate1: new Date(2019, 11, 4),
      testArr1: [1, 2],
      testStr2: 'str3',
      testDate2: new Date(2019, 11, 10),
      testArr2: [5, 6],
    };
    const tiDatas = {
      testStr1: JSON.stringify('str1'),
      testDate1: JSON.stringify(new Date(2019, 11, 4).toDateString()),
      testArr1: JSON.stringify([1, 2]),
      testStr2: JSON.stringify('str3'),
      testDate2: JSON.stringify(new Date(2019, 11, 10).toDateString()),
      testArr2: JSON.stringify([5, 6]),
    };
    const Test = new Table.Table(p1, p2);
    test('id', () => expect(Test.id).toBe(1));
    test('tableName', () => expect(Test.tableName).toBe('testTable'));
    test('props', () => Object.keys(tDatas).forEach(key => typeof Test[key] === 'object' ? expect(Test[key]).toStrictEqual(tDatas[key]) : expect(Test[key]).toBe(tDatas[key])));
    test('getInstKey()', () => expect(Test.getInstKey()).toStrictEqual(tProps));
    test('getInstData()', async () => expect(await Test.getInstData()).toStrictEqual(tiDatas));
    test('insertToDB()', async () => expect(await Test.insertToDB()).toBeInstanceOf(Table.Table));
    const Test2 = new Table.Table(p1);
    test('retriveFromDB()', async () => expect(await Test2.retriveFromDB()).toBeInstanceOf(Table.Table));
    test('props', () => Object.keys(tDatas).forEach(key => typeof Test2[key] === 'object' ? expect(Test2[key]).toStrictEqual(tDatas[key]) : expect(Test2[key]).toBe(tDatas[key])));
    test('getInstKey()', () => expect(Test2.getInstKey()).toStrictEqual(tProps));
    test('getInstData()', async () => expect(await Test2.getInstData()).toStrictEqual(tiDatas));
    test('deleteFromDB()', async () => expect(await Test2.deleteFromDB()).toBeInstanceOf(Table.Table));
  });
  test('db.clear(true)', async () => {
    expect(await Table.db.clear(true)).toBeUndefined();
  });
});
