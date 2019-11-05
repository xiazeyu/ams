"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recordDatabase_1 = require("./lib/recordDatabase");
const db = new recordDatabase_1.Database('./store.db');
class Student {
    constructor(stuID, name) {
        this.stuID = stuID;
        this.name = name;
    }
}
class Reason {
    constructor(reaID, name) {
        this.reaID = reaID;
        this.name = name;
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
}
class index {
    constructor(stuIDs, reaIDs, absIDs, odaIDs) {
        this.stuIDs = stuIDs;
    }
}
