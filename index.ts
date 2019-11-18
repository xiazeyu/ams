const fs = require('fs');
const figlet = require('figlet');
const inquirer = require('inquirer');

const dDate = new Date(),
  dYestday = new Date(dDate.getFullYear(), dDate.getMonth(), dDate.getDate() - 1),
  sNow = `-${dDate.getFullYear()}-${dDate.getMonth()}-${dDate.getDate()}`,
  sYestday = `-${dYestday.getFullYear()}-${dYestday.getMonth()}-${dYestday.getDate()}`;
if (!fs.existsSync(`./data/db${sNow}.json`) && fs.existsSync(`./data/db${dYestday}.json`)) {
  const readable = fs.createReadStream(`./data/db${sYestday}.json`),
    writable = fs.createWriteStream(`./data/db${sNow}.json`);
  readable.pipe(writable);
}
process.env.DB_ADDRESS = `./data/db${sNow}.json`;

import { index, Student, Abscence, lesson, IStuStatus, statusArr, weekDayArr, lessonArr } from './src/table';

function stats(staMap: Map<number, IStuStatus>): {} {

  const res = {
    '到场': 0,
    '迟到': 0,
    '早退': 0,
    '旷课': 0,
    '事假': 0,
    '病假': 0,
  };
  staMap.forEach((val) => {
    res[val.status]++;
  })
  return res;

}

async function getCurrStatus(lesson: lesson): Promise<Map<number, IStuStatus>> {

  const allStus = await Promise.all(index.stu.map((val) => new Student({ id: val }).retriveFromDB())).then((stuArr) => {
    return stuArr.reduce((acc, cur) => {
      return acc.set(cur.id, {
        name: cur.name,
        id: cur.id,
        // phone: cur.phone,
        status: '到场',
      }), acc;
    }, new Map());
  });

  return Promise.all(index.abs.map((val) => new Abscence({ id: val }).getCurrStatus(lesson))).then((absArr) => {
    return absArr.reduce((acc, cur) => {
      acc.set(cur.id, Object.assign({}, acc.get(cur.id), {
        status: cur.status,
      }, cur.detailedReason ? {
        detailedReason: cur.detailedReason,
      } : {}));
      return acc;
    }, allStus);
  });

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
          if (ans.confirm)
            await t.insertToDB();
        })
    });
}

(async () => {
  console.log(figlet.textSync('AMS', { font: 'ANSI Shadow' }));
  console.log(figlet.textSync('by xiazeyu.'));
  await index.retriveFromDB();
  // await require('./firstRun').firstRun();
  while (1) {
    await inquirer
      .prompt([{
        name: 'action',
        message: 'What to do:',
        type: 'rawlist',
        choices: [
          { name: 'Show status.', value: 1 },
          { name: 'Show statics.', value: 2 },
          { name: 'Add abscent.', value: 3 },
        ]
      }]).then(async (ans) => {
        switch (ans.action) {
          case 1:
            console.log(await getCurrStatus(10));
            break;
          case 2:
            console.log(stats(await getCurrStatus(10)));
            break;
          case 3:
            await addAbs();
            break;
        };
      });
  }
})()
