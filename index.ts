const fs = require('fs');
const figlet = require('figlet');
const inquirer = require('inquirer');

process.env.DB_ADDRESS = './data/db.json';

import { index, Student, Abscence, lesson, IStuStatus, statusArr, weekDayArr, lessonArr, IAbscence } from './src/table';

async function utilitiesMenu() {
  let flag = true;
  while (flag) {
    await inquirer
      .prompt([{
        name: 'action',
        message: 'What to do:',
        type: 'rawlist',
        choices: [
          { name: 'Backup database.', value: 1 },
          { name: 'First run setup.', value: 2 },
          { name: 'Exit.', value: -1 },
        ]
      }]).then(async (ans) => {
        switch (ans.action) {
          case 1:
            backDatabase();
            break;
          case 2:
            await require('./firstRun').firstRun();
            break;
          case -1:
            flag = false
            return;
        }
      });
  }
}

function backDatabase() {
  const currTimeSuffix = `-${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}-${new Date().getHours()}`;
  if (!fs.existsSync(`./data/db${currTimeSuffix}.json`) && fs.existsSync(`./data/db.json`)) {
    const readable = fs.createReadStream('./data/db.json'),
      writable = fs.createWriteStream(`./data/db${currTimeSuffix}.json`);
    readable.pipe(writable);
  }
  return;
}

async function staticsMenu() {
  let tmp, flag = true;
  while (flag) {
    await inquirer
      .prompt([{
        name: 'action',
        message: 'What to do:',
        type: 'rawlist',
        choices: tmp !== undefined ? [
          { name: 'get all students status.', value: 1 },
          { name: 'count status.', value: 2 },
          { name: 'Exit.', value: -1 },
        ] : [
            { name: 'get all students status.', value: 1 },
            { name: 'Exit.', value: -1 },
          ]
      }]).then(async (ans) => {
        switch (ans.action) {
          case 1:
            tmp = await getAllStuStatusQuery();
            console.log(tmp);
            break;
          case 2:
            console.log(countStatus(tmp));
            break;
          case -1:
            flag = false;
            return;
        }
      });
  }
}

async function getAllStuStatusQuery(): Promise<IStuStatus[]> {
  return await inquirer
    .prompt([{
      name: 'date',
      message: 'Date:',
      default: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
    }, {
      name: 'lesson',
      type: 'list',
      message: 'Please choose the lesson:',
      default: 9,
      choices: lessonArr,
    }]).then(async (ans) => {
      return await getAllStuStatus(new Date(new Date(ans.date).toDateString()), ans.lesson);
    });
}

async function getAllStuStatus(date: Date, lesson: lesson): Promise<Map<number, IStuStatus>> {

  const allStus = await Promise.all(index.stu.map((val) => new Student({ id: val }).retriveFromDB())).then((stuArr: Student[]) => {
    return stuArr.reduce((acc, cur) => {
      return acc.set(cur.id, {
        name: cur.name,
        id: cur.id,
        // phone: cur.phone,
        status: '未到',
      }), acc;
    }, new Map());
  });

  return Promise.all(index.abs.map((val) => new Abscence({ id: val }).retriveFromDB())).then((absObjArr: Abscence[]) => {
    return absObjArr.reduce((acc, cur) => {
      // const tmp = Object.assign({}, cur, {props: undefined});
      // console.log(tmp, cur.isActive(date, lesson), date, lesson);
      if (cur.isActive(date, lesson))
        acc.set(cur.student.id, Object.assign({}, acc.get(cur.student.id), {
          status: cur.reason,
        }, cur.detailedReason ? { detailedReason: cur.detailedReason } : {}));
      return acc;
    }, allStus);
  });

}

function countStatus(staMap: Map<number, IStuStatus>): {} {

  const res = {};

  staMap.forEach((val) => {
    res[val.status] = { count: 0 };
  });
  res['未到'] = { count: 0, members: '' };

  staMap.forEach((val) => {
    if (val.status !== '未到')
      res[val.status][val.detailedReason] = { count: 0, members: '' };
  });

  staMap.forEach((val) => {
    res[val.status].count++;
    if (val.status === '未到')
      res[val.status].members = `${val.name}, ${res[val.status].members}`;
    else {
      res[val.status][val.detailedReason].count++;
      res[val.status][val.detailedReason].members = `${val.name}, ${res[val.status][val.detailedReason].members}`;
    }
  });
  return res;

}

async function abscenceMenu() {
  let flag = true;
  while (flag) {
    await inquirer
      .prompt([{
        name: 'action',
        message: 'What to do:',
        type: 'rawlist',
        choices: [
          { name: 'add Abscence record.', value: 1 },
          { name: 'show Abscence record.', value: 2 },
          { name: 'delete Abscence record.', value: 3 },
          { name: 'Exit.', value: -1 },
        ]
      }]).then(async (ans) => {
        switch (ans.action) {
          case 1:
            await addAbs();
            break;
          case 2:
            await showAllAbsQuery();
            break;
          case 3:
            await delAbs();
            break;
          case -1:
            flag = false;
            return;
        }
      });
  }
}

async function addAbs() {
  return await inquirer
    .prompt([{
      name: 'studentID',
      message: 'Please input the student\'s ID:',
      validate: ans => index.stu.includes(JSON.parse(ans)),
    }, {
      name: 'reason',
      type: 'list',
      message: 'Please choose the reason:',
      choices: statusArr,
    }, {
      name: 'detailedReason',
      message: 'Please input the detailed reason:',
    }, {
      name: 'dateFrom',
      message: 'Please input the beginning date:',
    }, {
      name: 'dateTo',
      message: 'Please input the ending date:',
    }, {
      name: 'weekDays',
      type: 'checkbox',
      message: 'Please choose the week days:',
      choices: weekDayArr,
    }, {
      name: 'lessons',
      type: 'checkbox',
      message: 'Please choose the lessons:',
      choices: lessonArr,
    }])
    .then(async (ans) => {
      const data = {
        id: index.abs.length,
        student: await new Student({ id: JSON.parse(ans.studentID) }).retriveFromDB(),
        reason: ans.reason,
        detailedReason: ans.detailedReason,
        dateFrom: new Date(ans.dateFrom),
        dateTo: new Date(ans.dateTo),
        weekDays: ans.weekDays || [],
        lessons: ans.lessons || [],
      };
      const t = new Abscence(data);
      console.log({
        id: data.id,
        studentName: data.student.name,
        studentID: data.student.id,
        reason: data.reason,
        detailedReason: ans.detailedReason,
        dateFrom: data.dateFrom.toString(),
        dateTo: data.dateTo.toString(),
        weekDays: data.weekDays,
        lessons: data.lessons,
      });
      await inquirer
        .prompt([{
          name: 'confirm',
          type: 'confirm',
          message: 'ARE U SURE?',
        }])
        .then(async (ans) => {
          console.log(await ans.confirm);
          if (ans.confirm) {
            await t.insertToDB();
          }
        });
    });
}


async function showAllAbsQuery() {
  await inquirer
    .prompt([{
      name: 'action',
      message: 'by:',
      type: 'rawlist',
      choices: [
        { name: 'all.', value: 1 },
        { name: 'student.', value: 2 },
        { name: 'date.', value: 3 },
      ]
    }]).then(async (ans) => {
      switch (ans.action) {
        case 1:
          console.log(await showAllAbs());
          break;
        case 2:
          // TODO
          break;
        case 3:
          // new Date(new Date(ans.date).toDateString())
          // TODO
          break;
      }
    });
}

async function showAllAbs(): Promise<{}[]> {

  return Promise.all(index.abs.map((val) => new Abscence({ id: val }).retriveFromDB())).then((absObjArr: Abscence[]) => {
    return absObjArr.reduce((acc, cur) => {
      const curAbs = {
        id: cur.id,
        student: `${cur.student.id}${cur.student.name}`,
        reason: cur.reason,
        detailedReason: cur.detailedReason,
        dateFrom: cur.dateFrom.toDateString(),
        dateTo: cur.dateTo.toDateString(),
        weekDays: cur.weekDays.toString(),
        lessons: cur.lessons.toString(),
      };
      return acc.push(curAbs), acc;
    }, []);
  });

}


async function delAbs() {
  return await inquirer
    .prompt([{
      name: 'absID',
      message: 'Please input the abscence\'s ID:',
      validate: ans => index.abs.includes(JSON.parse(ans)),
    }])
    .then(async (ans) => {
      const data = new Abscence({ id: ans.absID });
      await data.retriveFromDB();
      console.log({
        id: data.id,
        studentName: data.student.name,
        studentID: data.student.id,
        reason: data.reason,
        detailedReason: ans.detailedReason,
        dateFrom: data.dateFrom.toString(),
        dateTo: data.dateTo.toString(),
        weekDays: data.weekDays,
        lessons: data.lessons,
      });
      await inquirer
        .prompt([{
          name: 'confirm',
          type: 'confirm',
          message: 'ARE U SURE?',
        }])
        .then(async (ans) => {
          console.log(await ans.confirm);
          if (ans.confirm) {
            await data.deleteFromDB();
          }
        });
    });
}

(async () => {
  console.log(figlet.textSync('AMS', { font: 'ANSI Shadow' }));
  console.log(figlet.textSync('by xiazeyu.'));
  await index.retriveFromDB();
  backDatabase();
  let flag = true;
  while (flag) {
    await inquirer
      .prompt([{
        name: 'action',
        message: 'What to do:',
        type: 'rawlist',
        choices: [
          { name: 'statics.', value: 1 },
          { name: 'Abscence.', value: 2 },
          { name: 'utilities.', value: 3 },
          { name: 'Exit.', value: -1 },
        ]
      }]).then(async (ans) => {
        switch (ans.action) {
          case 1:
            await staticsMenu();
            break;
          case 2:
            await abscenceMenu();
            break;
          case 3:
            await utilitiesMenu();
            break;
          case -1:
            flag = false;
            break;
        }
      });
  }
})();
