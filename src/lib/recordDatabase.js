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
            return {
                id: what.id,
                table: what.table,
                data: resArr.reduce((acc, cur, ind) => {
                    acc[what.data[ind]] = cur;
                    return acc;
                }, {}),
            };
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=recordDatabase.js.map