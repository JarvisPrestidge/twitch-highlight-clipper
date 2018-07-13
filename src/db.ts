import * as FileAsync from "lowdb/adapters/FileAsync";
import * as low from "lowdb";
import C from "./constants";
import { existsSync } from "fs";

export default (async () => {

    // Create the db instance
    const adapter = new FileAsync(C.DB_PATH);
    const db = await low(adapter);

    // Build default schema if doesn't exist
    if (!existsSync(C.DB_PATH)) {
        await db.defaults({ clips: [] }).write();
    }

    return db;
})();
