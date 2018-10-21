import * as FileAsync from "lowdb/adapters/FileAsync";
import * as lowdb from "lowdb";
import C from "../utils/constants";
import { createDirectory } from "../utils/filesystem";
import { IDBSchema } from "../interfaces/db/IDBSchema";
import { join } from "path";
import log from "../utils/logger";

/**
 * Database Store
 *
 * @class DB
 */
class DB {

    private db!: lowdb.LowdbAsync<IDBSchema>;

    /**
     * Initializes the db
     *
     * @returns {Promise<void>}
     */
    public async init(): Promise<void> {

        log.info("[DB-INIT]: start");

        // Create db directory if doesn't exist
        await createDirectory(C.DB_PATH);

        // Create the db instance
        const dbFilePath = join(C.DB_PATH, "db.json");
        const adapter = new FileAsync<IDBSchema>(dbFilePath);
        this.db = await lowdb(adapter);

        // Initial store values
        const defaults: IDBSchema = {
            clips: []
        };

        // Initialize store
        await this.db.defaults(defaults).write();

        log.info("[DB-INIT]: finish");
    }

    /**
     * Get value
     *
     * @template T
     * @param {string} key
     * @returns {Promise<T>}
     */
    public async get<T>(key: string): Promise<T> {
        return this.db
            .get(key)
            .value();
    }

    /**
     * Set single property value
     *
     * @template T
     * @param {string} key
     * @param {T} value
     * @returns {Promise<void>}
     */
    public async set<T>(key: string, value: T): Promise<void> {
        return await this.db
            .set(key, value)
            .write();
    }

    /**
     * Append value to list
     *
     * @template T
     * @param {string} collection
     * @param {T} value
     * @returns
     */
    public async listAppend<T>(collection: string, value: T) {
        return await this.db
            .get(collection)
            .push(value)
            .write();
    }

    /**
     * Update value in list which satisfies predicate
     *
     * @param {string} collection
     * @param {*} predicate
     * @param {*} assignment
     * @returns
     */
    public async listUpdate(collection: string, predicate: any, assignment: any) {
        return await this.db
            .get(collection)
            .find(predicate)
            .assign(assignment)
            .write();
    }

    /**
     * Remove value in list which satisfies predicate
     *
     * @param {string} collection
     * @param {*} predicate
     * @returns
     */
    public async listRemove(collection: string, predicate: any) {
        return await this.db
            .get(collection)
            .remove(predicate)
            .write();
    }

    /**
     * Find and return value in list which satisfies predicate
     *
     * @template T
     * @param {string} collection
     * @param {*} predicate
     * @returns {(Promise<T | undefined>)}
     */
    public async listFind<T>(collection: string, predicate: any): Promise<T | undefined> {
        return await this.db
            .get(collection)
            .find(predicate)
            .value() as T | undefined;
    }

    /**
     * Return list for a specific collection
     *
     * @template T
     * @param {string} collection
     * @returns {Promise<T[]>}
     */
    public async listGet<T>(collection: string): Promise<T[]> {
        return await this.db
            .get(collection)
            .value();
    }
}

export default new DB();
