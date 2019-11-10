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

  describe('index()', () => {
    const Test = Table.index;
    test('getStu', () => expect(Test.stu).toStrictEqual([]));
    test('getAbs', () => expect(Test.abs).toStrictEqual([]));
    test('addID("notExist")', async () => {
      expect.assertions(1);
      await expect(Test.addID('notExist', 1)).rejects.toEqual(new Error('notExist does not exist in the index table.'));
    });
    test('delID("notExist")', async () => {
      expect.assertions(1);
      await expect(Test.delID('notExist', 1)).rejects.toEqual(new Error('notExist does not exist in the index table.'));
    });
    test('addID("stu", 111)', async () => expect(await Test.addID('stu', 111)).toMatchObject(Test));
    test('getStu', () => expect(Test.stu).toStrictEqual([111]));
    test('addID("stu", 222)', async () => expect(await Test.addID('stu', 222)).toMatchObject(Test));
    test('getStu', () => expect(Test.stu).toStrictEqual([111, 222]));
    test('delID("stu", 111)', async () => expect(await Test.delID('stu', 111)).toMatchObject(Test));
    test('getStu', () => expect(Test.stu).toStrictEqual([222]));
    test('delID("stu", 222)', async () => expect(await Test.delID('stu', 222)).toMatchObject(Test));
    test('getStu', () => expect(Test.stu).toStrictEqual([]));
    test('addID("abs", 111)', async () => expect(await Test.addID('abs', 111)).toMatchObject(Test));
    test('getAbs', () => expect(Test.abs).toStrictEqual([111]));
    test('addID("abs", 222)', async () => expect(await Test.addID('abs', 222)).toMatchObject(Test));
    test('getAbs', () => expect(Test.abs).toStrictEqual([111, 222]));
    test('delID("abs", 111)', async () => expect(await Test.delID('abs', 111)).toMatchObject(Test));
    test('getAbs', () => expect(Test.abs).toStrictEqual([222]));
    test('delID("abs", 222)', async () => expect(await Test.delID('abs', 222)).toMatchObject(Test));
    test('getAbs', () => expect(Test.abs).toStrictEqual([]));

  });


  describe('Student()', () => {
    const Test = new Table.Student();
  });

  describe('Abscence()', () => {
    const Test = new Table.Abscence();
  });

  test('db.clear(true)', async () => {
    expect(await Table.db.clear(true)).toBeUndefined();
  });
});
