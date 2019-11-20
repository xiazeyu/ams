const fs = require('fs');
const figlet = require('figlet');
const inquirer = require('inquirer');

process.env.DB_ADDRESS = './data/db.json';

import { index, Student, Abscence, lesson, IStuStatus, statusArr, weekDayArr, lessonArr } from './src/table';

async function utilitiesMenu() {
  while (1) {
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
            return;
        }
      });
  }
}

function backDatabase() {
  const currTimeSuffix = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}/${new Date().getHours()}${new Date().getMinutes()}`;
  if (!fs.existsSync(`./data/db${currTimeSuffix}.json`) && fs.existsSync(`./data/db.json`)) {
    const readable = fs.createReadStream('./data/db.json'),
      writable = fs.createWriteStream(`./data/db${currTimeSuffix}.json`);
    readable.pipe(writable);
  }
  return;
}

async function staticsMenu() {
  let tmp;
  while (1) {
    await inquirer
      .prompt([{
        name: 'action',
        message: 'What to do:',
        type: 'rawlist',
        choices: [
          { name: 'get all students status.', value: 1 },
          { name: 'count status.', value: 2 },
          { name: 'Exit.', value: -1 },
        ]
      }]).then(async (ans) => {
        switch (ans.action) {
          case 1:
            tmp = await getAllStuStatus(10);
            break;
          case 2:
            countStatus(tmp);
            break;
          case -1:
            return;
        }
      });
  }
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

async function getAllStuStatus(lesson: lesson): Promise<Map<number, IStuStatus>> {

  const allStus = await Promise.all(index.stu.map((val) => new Student({ id: val }).retriveFromDB())).then((stuArr) => {
    return stuArr.reduce((acc, cur) => {
      return acc.set(cur.id, {
        name: cur.name,
        id: cur.id,
        // phone: cur.phone,
        status: '未到',
      }), acc;
    }, new Map());
  });

  return Promise.all(index.abs.map((val) => new Abscence({ id: val }).retriveFromDB())).then(async (absObjArr: Abscence[]) => {
    return await absObjArr.reduce(async (acc, cur) => {
      const todayStatus = await cur.getTodayStatus(lesson);
      acc.set(cur.id, Object.assign({}, acc.get(cur.id), {
        status: cur.getTodayStatus(lesson),
      }, todayStatus.detailedReason ? {
        detailedReason: todayStatus.detailedReason,
      } : {}));
      return acc;
    }, allStus);
  });

}

async function addMenu() {
  while (1) {
    await inquirer
      .prompt([{
        name: 'action',
        message: 'What to do:',
        type: 'rawlist',
        choices: [
          { name: 'add Abscence record.', value: 1 },
          { name: 'Exit.', value: -1 },
        ]
      }]).then(async (ans) => {
        switch (ans.action) {
          case 1:
            addAbs();
            break;
          case -1:
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
          { name: 'add.', value: 2 },
          { name: 'utilities.', value: 3 },
          { name: 'Exit.', value: -1 },
        ]
      }]).then(async (ans) => {
        switch (ans.action) {
          case 1:
            await staticsMenu();
            break;
          case 2:
            await addMenu();
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
