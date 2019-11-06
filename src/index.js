"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tables_1 = require("./tables");
const defaultReason = require("../data/defRea.json");
async function initReason() {
    return Promise.all(defaultReason.map(async (v) => {
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
async function playground() {
}
initReason();
playground();
