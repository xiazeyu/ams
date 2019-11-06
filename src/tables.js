"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recordDatabase_1 = require("./lib/recordDatabase");
const db = new recordDatabase_1.Database('../data/storedb.json');
class Table {
    constructor(val) {
        val = Object.assign(val, {
            id: 0,
            tableName: 'table',
            props: [],
        });
        Object.keys(val).forEach(key => this[key] = val[key]);
    }
    async getInstData() {
        return this.props.reduce(async (acc, cur) => {
            acc[cur.key] = await cur.setMethod(this[cur.key]);
            return acc;
        }, {});
    }
    async genInstData() {
        return {
            id: this.id,
            table: this.tableName,
            data: await this.getInstData(),
        };
    }
    async genKeys() {
        const keysArr = Object.keys(await this.getInstData());
        return Object.assign(await this.genInstData(), { data: keysArr });
    }
    showInfo() {
        console.log(this.props.map((propName) => {
            return { k: propName, v: this[propName.key] };
        }));
        return undefined;
    }
    async insertToDB() {
        return await db.insertRecord(await this.genInstData());
    }
    async retriveFromDB() {
        return await db.queryRecord(await this.genKeys()).then(async (retData) => {
            return await Promise.all(this.props.map(val => val.getMethod(retData.data[val.key]))).then(async (result) => {
                result.reduce(((acc, cur, ind) => this[this.props[ind].key] = cur));
                return await this.genInstData();
            });
        });
    }
    async deleteFromDB() {
        return await db.deleteRecord(await this.genKeys());
    }
}
class Index extends Table {
    constructor(val) {
        super({
            id: 0,
            tableName: 'index',
            props: [
                { key: 'stuIDs', getMethod: a => JSON.parse(a), setMethod: a => JSON.stringify(a) },
                { key: 'reaIDs', getMethod: a => JSON.parse(a), setMethod: a => JSON.stringify(a) },
                { key: 'absIDs', getMethod: a => JSON.parse(a), setMethod: a => JSON.stringify(a) },
                { key: 'odaIDs', getMethod: a => JSON.parse(a), setMethod: a => JSON.stringify(a) },
            ],
        });
        val = Object.assign(val, {
            stuIDs: [],
            reaIDs: [],
            absIDs: [],
            odaIDs: [],
        });
        Object.keys(val).forEach(key => this[key] = val[key]);
    }
}
const index = new Index();
exports.index = index;
class Student extends Table {
    constructor(val) {
        super({
            id: 0,
            tableName: 'student',
            props: [
                { key: 'name', getMethod: a => JSON.parse(a), setMethod: a => JSON.stringify(a) },
                { key: 'phone', getMethod: a => JSON.parse(a), setMethod: a => JSON.stringify(a) },
            ],
        });
        val = Object.assign(val, {
            name: '',
            phone: 0,
        });
        Object.keys(val).forEach(key => this[key] = val[key]);
    }
}
exports.Student = Student;
class Reason extends Table {
    constructor(val) {
        super({
            id: 0,
            tableName: 'reason',
            props: [
                { key: 'name', getMethod: a => JSON.parse(a), setMethod: a => JSON.stringify(a) },
            ],
        });
        val = Object.assign(val, {
            name: '',
        });
        Object.keys(val).forEach(key => this[key] = val[key]);
    }
}
exports.Reason = Reason;
class Abscence extends Table {
    constructor(val) {
        super({
            id: 0,
            tableName: 'abscence',
            props: [
                { key: 'student', getMethod: a => { const t = new Student({ id: JSON.parse(a) }); t.retriveFromDB(); return t; }, setMethod: a => JSON.stringify(a.id) },
                { key: 'reason', getMethod: a => { const t = new Reason({ id: JSON.parse(a) }); t.retriveFromDB(); return t; }, setMethod: a => JSON.stringify(a.id) },
                { key: 'dateFrom', getMethod: a => new Date(JSON.parse(a)), setMethod: a => JSON.stringify(a.toDateString()) },
                { key: 'dateTo', getMethod: a => new Date(JSON.parse(a)), setMethod: a => JSON.stringify(a.toDateString()) },
                { key: 'week', getMethod: a => JSON.parse(a), setMethod: a => JSON.stringify(a) },
                { key: 'lesson', getMethod: a => JSON.parse(a), setMethod: a => JSON.stringify(a) },
            ],
        });
        val = Object.assign(val, {
            student: new Student(),
            reason: new Reason(),
            dateFrom: new Date(2019, 11, 4),
            dateTo: new Date(2019, 11, 5),
            week: 0,
            lesson: [0],
        });
        Object.keys(val).forEach(key => this[key] = val[key]);
    }
}
exports.Abscence = Abscence;
