import { index, Student, Abscence } from './src/table';
import { defStu } from './data/defStu.js'; // "姓名", 学号", 手机号"
import { defIELTS } from './data/defIELTS.js'; // "姓名", "学号", "开始日期": "xxxx-xx-xx", "结束日期": "xxxx-xx-xx", "星期": "[x, x, ]"

export async function firstRun(){
  await initStudent();
  await initIELTS();
}
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
  const offset = index.abs.length;
  return Promise.all(defIELTS.map(async (v, ind) => {
    const s = new Abscence({
      id: offset + ind,
      student: new Student({ id: JSON.parse(v['学号']) }),
      reason: '事假',
      detailedReason: '雅思',
      dateFrom: new Date(v['开始日期']),
      dateTo: new Date(v['结束日期']),
      weekDays: JSON.parse(`"${v['星期']}"`),
      lessons: [10],
    });
    await s.insertToDB();
  }));
}
