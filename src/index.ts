import { index, Student, Reason, Abscence } from './tables';
import {defRea} from '../data/defRea.js';
import {defStu} from '../data/defStu.js';

async function initReason() {
  return Promise.all(defRea.map(async (v) => {
    const r = new Reason();
    r.id = v.id;
    await r.retriveFromDB();
    if (!(r.name === v.name)) {
      r.name = v.name;
      await r.insertToDB();
      return true;
    }
    return false;
  })).then((r) => {
    console.log(r);
    return undefined;
  });
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

async function playground() {

}

index.retriveFromDB().then(() => {
  initReason();
  initStudent();
  playground();
});
