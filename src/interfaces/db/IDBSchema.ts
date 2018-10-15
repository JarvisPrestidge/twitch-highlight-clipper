import { IDBClip } from "./IDBClip";

/**
 * Represents the store data schema
 *
 * @export
 * @interface IDBSchema
 */
export interface IDBSchema {
    clips: IDBClip[];
}
