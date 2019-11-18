const fs = require('fs');
const figlet = require('figlet');
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

import { index, Student, Abscence, lesson, IStuStatus } from './src/table';

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

(async () => {
  console.log(figlet.textSync('Welcome to AMS.', { font: 'ANSI Shadow' }));
  console.log(figlet.textSync('Written by xiazeyu.'));
  await index.retriveFromDB();
  // await require('./firstRun').firstRun();
  const res = await getCurrStatus(10);
  const stat = stats(res);
  console.log(res);
  console.log(stat);
})()
