import * as FileSync from "lowdb/adapters/FileSync";
import * as lowdb from "lowdb";
import C from "../utils/constants";
import { createDirectory } from "../utils/filesystem";
import { join } from "path";
import { IDBSchema } from "../interfaces/db/IDBSchema";

// Create db directory if doesn't exist
(async () => await createDirectory(C.DB_PATH))();

// Create the db instance
const sourcePath = join(C.DB_PATH, "db.json");
const dbAdapter = new FileSync(sourcePath);
const db = lowdb(dbAdapter);

// Initial store state
const defaults: IDBSchema = {
    clips: []
};

db.defaults(defaults).write();

export default db;
