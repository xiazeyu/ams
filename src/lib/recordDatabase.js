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
        }, what.data[keyName])));
    }
    deleteRecord(what) {
        return Promise.all(what.data.map(keyName => this.delete({
            id: what.id,
            key: keyName,
            table: what.table
        })));
    }
    queryRecord(what) {
        return Promise.all(what.data.map(keyName => this.get({
            id: what.id,
            key: keyName,
            table: what.table,
        }))).then(resArr => {
            const data = {};
            resArr.reduce((prev, curr, index) => {
                return data[what.data[index]] = curr;
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
