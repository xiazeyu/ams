"use strict";
const Keyv = require("keyv");
const keyv_file_1 = require("keyv-file");
;
class Database {
    constructor(fileName) {
        this.fileName = fileName;
        this.db = new Keyv({
            'store': new keyv_file_1.default({
                'filename': fileName,
            }),
        });
        this.db.on('error', err => {
            console.log('Connection error', err);
        });
    }
    ;
    genFullKeyName(key) {
        return `${key.table}:${key.key}:${key.id}`;
    }
    async set(key, value) {
        return await this.db.set(this.genFullKeyName(key), value);
    }
    async get(key) {
        return await this.db.get(this.genFullKeyName(key));
    }
    async delete(key) {
        return await this.db.delete(this.genFullKeyName(key));
    }
    async clear(flag) {
        return flag ? await this.db.clear() : undefined;
    }
}
const currDB = new Database('./store.db');
module.exports = currDB;
//# sourceMappingURL=connection.js.map