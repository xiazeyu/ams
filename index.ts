process.env.DB_ADDRESS = './data/storedb.json';

import { index, Student, Abscence } from './src/table';
import { defStu } from './data/defStu.js'; // "姓名", 学号", 手机号"
import { defIELTS } from './data/defIELTS.js'; // "姓名", "学号", "开始日期": "xxxx-xx-xx", "结束日期": "xxxx-xx-xx", "星期": "[x, x, ]"


async function initStudent() {
  return Promise.all(defStu.map(async (v) => {
    const s = new Student();
    s.id = JSON.parse(v['学号']);
    await s.retriveFromDB();
    if (!(s.name === v['姓名'])) {
      s.name = v['姓名'];
      s.phone = JSON.parse(v['手机号']);
      await s.insertToDB();
      return true;
    }
    return false;
  })).then((r) => {
    console.log(r);
    return undefined;
  });
}

async function initIELTS() {
  return Promise.all(defIELTS.map(async (v) => {
    const s = new Abscence();
    s.id = JSON.parse(v['学号']);
    s.dateFrom = new Date(v['开始日期']);
    s.dateTo = new Date(v['结束日期']);
    s.weekDays = JSON.parse(v['星期']);
    s.reason = '事假';
    s.detailedReason = '雅思';
  }));
}

async function playground() {

}

(async () => {
  await index.retriveFromDB();
  await initStudent();
  await initIELTS();
  await playground();
})()
