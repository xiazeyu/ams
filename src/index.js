"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recordDatabase_1 = require("./lib/recordDatabase");
class Student {
    constructor(stuID = 0, name = '') {
        this.stuID = stuID;
        this.name = name;
    }
    showInfo() {
        console.log(`stuID: ${this.stuID}, name: ${this.name}`);
        return;
    }
    genRecordData() {
        return {
            id: this.stuID,
            table: 'student',
            data: {
                name: this.name,
            },
        };
    }
    genRecordKey() {
        const dataKeys = Object.keys(this.genRecordData().data);
        return Object.assign(this.genRecordData(), { data: dataKeys });
    }
    insertToDB(DB) {
        return DB.insertRecord(this.genRecordData());
    }
    retriveFromDB(DB) {
        return DB.queryRecord(this.genRecordKey()).then((result) => {
            this.genRecordKey().data.forEach((keyName) => {
                this[keyName] = result.data[keyName];
            });
            return undefined;
        });
    }
    deleteFromDB(DB) {
        return DB.deleteRecord(this.genRecordKey());
    }
}
class Reason {
    constructor(reaID = 0, name = '') {
        this.reaID = reaID;
        this.name = name;
    }
    showInfo() {
        console.log(`reaID: ${this.reaID}, name: ${this.name}`);
        return;
    }
    genRecordData() {
        return {
            id: this.reaID,
            table: 'reason',
            data: {
                name: this.name,
            },
        };
    }
    genRecordKey() {
        const dataKeys = Object.keys(this.genRecordData().data);
        return Object.assign(this.genRecordData(), { data: dataKeys });
    }
    insertToDB(DB) {
        return DB.insertRecord(this.genRecordData());
    }
    retriveFromDB(DB) {
        return DB.queryRecord(this.genRecordKey()).then((result) => {
            this.genRecordKey().data.forEach((keyName) => {
                this[keyName] = result.data[keyName];
            });
            return undefined;
        });
    }
    deleteFromDB(DB) {
        return DB.deleteRecord(this.genRecordKey());
    }
}
class Abscence {
    constructor(absID, student, reason, dateFrom, dateTo, lesson) {
        this.absID = absID;
        this.student = student;
        this.reason = reason;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.lesson = lesson;
    }
    showInfo() {
        console.log(`absID: ${this.absID}, stuName&ID: ${this.student.name}${this.student.stuID}, rea: ${this.reason.name}, date: ${this.dateFrom}`);
        return;
    }
    genRecordData() {
        return {
            id: this.absID,
            table: 'abscence',
            data: {},
        };
    }
    genRecordKey() {
        const dataKeys = Object.keys(this.genRecordData().data);
        return Object.assign(this.genRecordData(), { data: dataKeys });
    }
    insertToDB(DB) {
        return DB.insertRecord(this.genRecordData());
    }
    retriveFromDB(DB) {
        return DB.queryRecord(this.genRecordKey()).then((result) => {
            this.genRecordKey().data.forEach((keyName) => {
                this[keyName] = result.data[keyName];
            });
            return undefined;
        });
    }
    deleteFromDB(DB) {
        return DB.deleteRecord(this.genRecordKey());
    }
}
class Index {
    constructor(db, stuIDs = [], reaIDs = [], absIDs = [], odaIDs = []) {
        this.db = db;
        this.stuIDs = stuIDs;
    }
}
const currDB = new recordDatabase_1.Database('./storedb.json');
const currIndex = new Index(currDB);
async function initReason() {
    const defaultReason = [
        { reaID: 0, name: '请假' },
        { reaID: 1, name: '雅思课程' },
        { reaID: 2, name: '党课' },
        { reaID: 3, name: '篮球队集训' },
    ];
    return Promise.all(defaultReason.map(async (v) => {
        const r = new Reason();
        r.reaID = v.reaID;
        await r.retriveFromDB(currDB);
        if (!r.name) {
            r.name = v.name;
            await r.insertToDB(currDB);
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
initReason();
playground();
