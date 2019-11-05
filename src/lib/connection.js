"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keyv = require("keyv");
const keyv_file_1 = require("keyv-file");
class Connection {
    constructor(fileName) {
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
    genFullKeyPath(key) {
        return `${key.table}:${key.key}:${key.id}`;
    }
    async set(key, value) {
        return await this.db.set(this.genFullKeyPath(key), value);
    }
    async get(key) {
        return await this.db.get(this.genFullKeyPath(key));
    }
    async delete(key) {
        return await this.db.delete(this.genFullKeyPath(key));
    }
    async clear(flag) {
        return flag ? await this.db.clear() : undefined;
    }
}
exports.Connection = Connection;
