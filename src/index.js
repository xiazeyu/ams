"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recordDatabase_1 = require("./lib/recordDatabase");
const db = new recordDatabase_1.Database('./storedb.json');
class Table {
    constructor(prop = { id: 0, tableName: 'table' }) {
        this.id = 0;
        this.tableName = 'table';
        (this.props = Object.keys(prop)).forEach((propName) => {
            this[propName] = prop[propName];
        });
    }
    getPropsData() {
        const t = {};
        this.props.forEach((propName) => {
            if (!(propName === 'id' || propName === 'tableName'))
                t[propName] = this[propName];
        });
        return t;
    }
    genRecordData() {
        return {
            id: this.id,
            table: this.tableName,
            data: this.getPropsData(),
        };
    }
    genRecordKey() {
        const dataKeys = Object.keys(this.genRecordData().data);
        return Object.assign(this.genRecordData(), { data: dataKeys });
    }
    showInfo() {
        console.log(this.props.map((propName) => {
            return { k: propName, v: this[propName] };
        }));
        return undefined;
    }
    insertToDB() {
        return db.insertRecord(this.genRecordData());
    }
    retriveFromDB() {
        return db.queryRecord(this.genRecordKey()).then((result) => {
            this.genRecordKey().data.forEach((keyName) => {
                this[keyName] = result.data[keyName];
            });
            return undefined;
        });
    }
    deleteFromDB() {
        return db.deleteRecord(this.genRecordKey());
    }
}
class Index extends Table {
    constructor(prop = { id: 0, tableName: 'index', stuIDs: [], reaIDs: [], absIDs: [], odaIDs: [] }) {
        super(prop);
    }
}
const index = new Index();
class Student extends Table {
    constructor(prop = { id: 0, tableName: 'student', name: '' }) {
        super(prop);
    }
}
class Reason extends Table {
    constructor(prop = { id: 0, tableName: 'reason', name: '' }) {
        super(prop);
    }
}
class Abscence extends Table {
    constructor(prop = { id: 0, tableName: 'abscence', student: new Student(), reason: new Reason(), dateFrom: new Date(2019, 11, 4), dateTo: new Date(2019, 11, 5), lesson: [0] }) {
        super(prop);
    }
}
async function initReason() {
    const defaultReason = [
        { id: 0, name: '请假' },
        { id: 1, name: '雅思课程' },
        { id: 2, name: '党课' },
        { id: 3, name: '篮球队集训' },
    ];
    return Promise.all(defaultReason.map(async (v) => {
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
async function playground() {
}
initReason();
playground();
