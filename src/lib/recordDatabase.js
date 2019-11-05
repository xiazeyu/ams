"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
class Database extends connection_1.Connection {
    constructor(fileName) {
        super(fileName);
    }
    insertRecord(what) {
        return Promise.all(Object.keys(what.data).map(keyName => this.set({
            id: what.id,
            key: keyName,
            table: what.table,
        }, what.data[keyName]))).then(() => {
            return undefined;
        });
    }
    deleteRecord(what) {
        return Promise.all(what.data.map(keyName => this.delete({
            id: what.id,
            key: keyName,
            table: what.table,
        }))).then(() => {
            return undefined;
        });
    }
    queryRecord(what) {
        return Promise.all(what.data.map(keyName => this.get({
            id: what.id,
            key: keyName,
            table: what.table,
        }))).then(resArr => {
            const data = {};
            resArr.forEach((value, index) => {
                data[what.data[index]] = value;
            });
            return {
                id: what.id,
                table: what.table,
                data: data,
            };
        });
    }
}
exports.Database = Database;
