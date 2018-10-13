import * as FileSync from "lowdb/adapters/FileSync";
import * as low from "lowdb";
import C from "./constants";

// Create the db instance
const adapter = new FileSync(C.DB_PATH);
const db = low(adapter);

// Build default schema if doesn't exist
const hasAuth = db.has("auth").value();
const hasClips = db.has("clips").value();

if (!hasAuth || !hasClips) {
    db.defaults({ auth: {}, clips: [] }).write();
}

export default db;
