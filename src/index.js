"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tables_1 = require("./tables");
const defRea_js_1 = require("../data/defRea.js");
const defStu_js_1 = require("../data/defStu.js");
async function initReason() {
    return Promise.all(defRea_js_1.defRea.map(async (v) => {
        const r = new tables_1.Reason();
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
    return Promise.all(defStu_js_1.defStu.map(async (v) => {
        const s = new tables_1.Student();
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
tables_1.index.retriveFromDB().then(() => {
    initReason();
    initStudent();
    playground();
});
//# sourceMappingURL=index.js.map