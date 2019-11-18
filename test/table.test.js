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
        { key: 'testStr1', defaultValue: 'str1', getMethod: async a => JSON.parse(a || '"str1"'), setMethod: async a => JSON.stringify(a) },
        { key: 'testDate1', defaultValue: new Date(2019, 10, 4), getMethod: async a => new Date(JSON.parse(a || '"Mon Nov 04 2019"')), setMethod: async a => JSON.stringify(a.toDateString()) },
        { key: 'testArr1', defaultValue: [1, 2], getMethod: async a => JSON.parse(a || '[1, 2]'), setMethod: async a => JSON.stringify(a) },
        { key: 'testStr2', defaultValue: 'str2', getMethod: async a => JSON.parse(a || '"str2"'), setMethod: async a => JSON.stringify(a) },
        { key: 'testDate2', defaultValue: new Date(2019, 10, 5), getMethod: async a => new Date(JSON.parse(a || '"Tue Nov 05 2019"')), setMethod: async a => JSON.stringify(a.toDateString()) },
        { key: 'testArr2', defaultValue: [3, 4], getMethod: async a => JSON.parse(a || '[3, 4]'), setMethod: async a => JSON.stringify(a) },
      ],
    };
    const p2 = {
      testStr2: 'str3',
      testDate2: new Date(2019, 10, 10),
      testArr2: [5, 6],
    };
    const tProps = ['testStr1', 'testDate1', 'testArr1', 'testStr2', 'testDate2', 'testArr2'];
    const tDatas = {
      testStr1: 'str1',
      testDate1: new Date(2019, 10, 4),
      testArr1: [1, 2],
      testStr2: 'str3',
      testDate2: new Date(2019, 10, 10),
      testArr2: [5, 6],
    };
    const dDatas = {
      testStr1: 'str1',
      testDate1: new Date(2019, 10, 4),
      testArr1: [1, 2],
      testStr2: 'str2',
      testDate2: new Date(2019, 10, 5),
      testArr2: [3, 4],
    };
    const tiDatas = {
      testStr1: JSON.stringify('str1'),
      testDate1: JSON.stringify(new Date(2019, 10, 4).toDateString()),
      testArr1: JSON.stringify([1, 2]),
      testStr2: JSON.stringify('str3'),
      testDate2: JSON.stringify(new Date(2019, 10, 10).toDateString()),
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
    test('retriveFromDB()', async () => expect(await Test2.retriveFromDB()).toBeInstanceOf(Table.Table));
    test('props', () => Object.keys(dDatas).forEach(key => typeof Test2[key] === 'object' ? expect(Test2[key]).toStrictEqual(dDatas[key]) : expect(Test2[key]).toBe(dDatas[key])));
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


  describe('Student', () => {
    describe('Student(basicTest)', () => {
      const Test = new Table.Student();
      test('id', () => expect(Test.id).toBe(0));
      test('tableName', () => expect(Test.tableName).toBe('student'));
      test('name', () => expect(Test.name).toBe(''));
      test('phone', () => expect(Test.phone).toBe(0));
      test('insertToDB()', async () => expect(await Test.insertToDB()).toBeInstanceOf(Table.Student));
      test('checkIndex(stu)', () => expect(Table.index.stu).toStrictEqual([0]));
      test('retriveFromDB()', async () => expect(await Test.retriveFromDB()).toBeInstanceOf(Table.Student));
      test('deleteFromDB()', async () => expect(await Test.deleteFromDB()).toBeInstanceOf(Table.Student));
      test('checkIndex(stu)', () => expect(Table.index.stu).toStrictEqual([]));
    });
    describe('Student(save & load', () => {
      const Test1 = new Table.Student({
        id: 123,
      });
      const Test2 = new Table.Student({
        id: 111,
        name: 'Bob',
        phone: 1234,
      });
      const Test3 = new Table.Student({
        id: 111,
      });
      test('retriveFromDB()', async () => expect(await Test1.retriveFromDB()).toBeInstanceOf(Table.Student));
      test('id', () => expect(Test1.id).toBe(123));
      test('name', () => expect(Test1.name).toBe('NOTFOUND'));
      test('phone', () => expect(Test1.phone).toBe(0));

      test('insertToDB()', async () => expect(await Test2.insertToDB()).toBeInstanceOf(Table.Student));

      test('retriveFromDB()', async () => expect(await Test3.retriveFromDB()).toBeInstanceOf(Table.Student));
      test('id', () => expect(Test3.id).toBe(111));
      test('name', () => expect(Test3.name).toBe('Bob'));
      test('phone', () => expect(Test3.phone).toBe(1234));
      test('deleteFromDB()', async () => expect(await Test3.deleteFromDB()).toBeInstanceOf(Table.Student));
    });
    describe('Student(fullTest)', () => {
      const Test = new Table.Student();
      test('getByName()', async () => {
        Test.id = 111;
        Test.name = "Bob";
        Test.phone = 123456;
        await Test.insertToDB();
        Test.id = 222;
        Test.name = "Alice";
        Test.phone = 654321;
        await Test.insertToDB();
        Test.id = 333;
        await Test.getByName('Bob');
        expect(Test.id).toBe(111);
        expect(Test.name).toBe('Bob');
        expect(Test.phone).toBe(123456);
        await Test.deleteFromDB();
        await Test.getByName('Alice');
        expect(Test.id).toBe(222);
        expect(Test.name).toBe('Alice');
        expect(Test.phone).toBe(654321);
        await Test.deleteFromDB();
      });
    });
  });

  describe('Abscence', () => {
    describe('Abscence(basicTest)', () => {
      const Test = new Table.Abscence();
      test('id', () => expect(Test.id).toBe(0));
      test('tableName', () => expect(Test.tableName).toBe('abscence'));
      test('student', () => expect(Test.student).toBeInstanceOf(Table.Student));
      test('reason', () => expect(Test.reason).toBe(''));
      test('detailedReason', () => expect(Test.detailedReason).toBe(''));
      test('dateFrom', () => expect(Test.dateFrom).toBeInstanceOf(Date));
      test('dateTo', () => expect(Test.dateTo).toBeInstanceOf(Date));
      test('weekDays', () => expect(Test.weekDays).toStrictEqual([]));
      test('lessons', () => expect(Test.lessons).toStrictEqual([]));
      test('insertToDB()', async () => expect(await Test.insertToDB()).toBeInstanceOf(Table.Abscence));
      test('checkIndex(stu)', () => expect(Table.index.abs).toStrictEqual([0]));
      test('retriveFromDB()', async () => expect(await Test.retriveFromDB()).toBeInstanceOf(Table.Abscence));
      test('deleteFromDB()', async () => expect(await Test.deleteFromDB()).toBeInstanceOf(Table.Abscence));
      test('checkIndex(stu)', () => expect(Table.index.abs).toStrictEqual([]));
    });
    describe('Abscence(save & load', () => {
      const testStu = new Table.Student({
        id: 123,
        name: 'Jack',
        phone: 3333,
      });
      const Test1 = new Table.Abscence({
        id: 123,
      });
      const Test2 = new Table.Abscence({
        id: 111,
        student: new Table.Student({
          id: 123,
        }),
        reason: '事假',
        detailedReason: '喝茶',
        dateFrom: new Date(2019, 09, 15),
        dateTo: new Date(2019, 10, 16),
        weekDays: [0, 6],
        lessons: [1, 2, 3, 4],
      });
      const Test3 = new Table.Abscence({
        id: 111,
      });
      test('insertTestStuToDB()', async () => expect(await testStu.insertToDB()).toBeInstanceOf(Table.Student));

      test('retriveFromDB()', async () => expect(await Test1.retriveFromDB()).toBeInstanceOf(Table.Abscence));
      test('id', () => expect(Test1.id).toBe(123));
      test('student', () => expect(Test1.student.id).toBe(0));
      test('reason', () => expect(Test1.reason).toBe('NOTFOUND'));
      test('detailedReason', () => expect(Test1.detailedReason).toBe('NOTFOUND'));
      test('dateFrom', () => expect(Test1.dateFrom).toEqual(new Date('Mon Nov 04 2019')));
      test('dateTo', () => expect(Test1.dateTo).toEqual(new Date('Tue Nov 05 2019')));
      test('weekDays', () => expect(Test1.weekDays).toStrictEqual([]));
      test('lessons', () => expect(Test1.lessons).toStrictEqual([]));

      test('insertToDB()', async () => expect(await Test2.insertToDB()).toBeInstanceOf(Table.Abscence));

      test('retriveFromDB()', async () => expect(await Test3.retriveFromDB()).toBeInstanceOf(Table.Abscence));
      test('id', () => expect(Test3.id).toBe(111));
      test('student', () => expect(Test3.student.id).toBe(123));
      test('student', () => expect(Test3.student.name).toBe('Jack'));
      test('student', () => expect(Test3.student.phone).toBe(3333));
      test('reason', () => expect(Test3.reason).toBe('事假'));
      test('detailedReason', () => expect(Test3.detailedReason).toBe('喝茶'));
      test('dateFrom', () => expect(Test3.dateFrom).toEqual(new Date(2019, 9, 15)));
      test('dateTo', () => expect(Test3.dateTo).toEqual(new Date(2019, 10, 16)));
      test('weekDays', () => expect(Test3.weekDays).toStrictEqual([0, 6]));
      test('lessons', () => expect(Test3.lessons).toStrictEqual([1, 2, 3, 4]));

      test('deleteTestStuFromDB()', async () => expect(await testStu.deleteFromDB()).toBeInstanceOf(Table.Student));
      test('deleteFromDB()', async () => expect(await Test3.deleteFromDB()).toBeInstanceOf(Table.Abscence));

    });
    describe('Abscence(fullTest)', () => {
      const Test1 = new Table.Abscence({
        dateFrom: new Date(2019, 10, 13),
        dateTo: new Date(2019, 10, 13),
      });
      const Test2 = new Table.Abscence({
        dateFrom: new Date(2019, 10, 13),
        dateTo: new Date(2019, 10, 15),
        lessons: [11, 12],
      });
      const Test3 = new Table.Abscence({
        dateFrom: new Date(2019, 10, 3),
        dateTo: new Date(2019, 10, 15),
        weekDays: [3],
      });
      const Test4 = new Table.Abscence({
        dateFrom: new Date(2019, 10, 3),
        dateTo: new Date(2019, 10, 25),
        lessons: [1],
        weekDays: [3, 4],
      });
      const testStu = new Table.Student({
        id: 123,
        name: 'Jack',
        phone: 3333,
      });
      const Test5 = new Table.Abscence({
        id: 111,
        student: new Table.Student({
          id: 123,
        }),
        reason: '事假',
        detailedReason: '喝茶',
        dateFrom: new Date(2019, 09, 15),
        dateTo: new Date(2019, 10, 20),
        weekDays: [0, 6],
        lessons: [1, 2, 3, 4],
      });
      const Test6 = new Table.Abscence({
        id: 123,
        student: new Table.Student({
          id: 123,
        }),
        reason: '事假',
        detailedReason: '喝茶2',
        dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        dateTo: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        weekDays: [new Date().getDay()],
      });
      test('insertTestStuToDB()', async () => expect(await testStu.insertToDB()).toBeInstanceOf(Table.Student));
      test('isActive(Test1)', () => {
        for (let i = 12; i <= 16; i++)
          for (let j = 1; j <= 12; j++)
            expect(Test1.isActive(new Date(2019, 10, i), j)).toBe((i === 13) ? true : false);
      });
      test('isActive(Test2)', () => {
        for (let i = 12; i <= 16; i++)
          for (let j = 1; j <= 12; j++)
            expect(Test2.isActive(new Date(2019, 10, i), j)).toBe((i >= 13) && (i <= 15) && (j >= 11) && (j <= 12) ? true : false);
      });
      test('isActive(Test3)', () => {
        for (let i = 1; i <= 30; i++)
          for (let j = 1; j <= 12; j++)
            expect(Test3.isActive(new Date(2019, 10, i), j)).toBe(((i === 6) || (i === 13)) ? true : false);
      });
      test('isActive(Test4)', () => {
        for (let i = 1; i <= 26; i++)
          for (let j = 1; j <= 12; j++)
            expect(Test4.isActive(new Date(2019, 10, i), j)).toBe((((i === 6) || (i === 7) || (i === 13) || (i === 14) || (i === 20) || (i === 21)) && (j === 1)) ? true : false);
      });
      test('getStatus(Test5)', async () => {
        await Test5.insertToDB();
        for (let i = 1; i <= 26; i++)
          for (let j = 1; j <= 12; j++)
            expect(await Test5.getStatus(new Date(2019, 10, i), j)).toStrictEqual({
              id: 123,
              name: 'Jack',
              phone: 3333,
              status: (((j >= 1) && (j <= 4)) && ((i === 2) || (i === 3) || (i === 9) || (i === 10) || (i === 16) || (i === 17))) ? '事假' : '到场',
              detailedReason: (((j >= 1) && (j <= 4)) && ((i === 2) || (i === 3) || (i === 9) || (i === 10) || (i === 16) || (i === 17))) ? '喝茶' : '',
            });
        await Test5.deleteFromDB();
      });
      test('getCurrStatus(Test6)', async () => {
        await Test6.insertToDB();
        for (let j = 1; j <= 12; j++)
          expect(await Test6.getCurrStatus(j)).toStrictEqual({
            id: 123,
            name: 'Jack',
            phone: 3333,
            status: '事假',
            detailedReason: '喝茶2',
          });
        await Test6.deleteFromDB();
      });
      test('deleteTestStuFromDB()', async () => expect(await testStu.deleteFromDB()).toBeInstanceOf(Table.Student));
    });
  });

  test('db.clear(true)', async () => {
    expect(await Table.db.clear(true)).toBeUndefined();
  });
});
