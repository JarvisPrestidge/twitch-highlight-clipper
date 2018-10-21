import db from "../db/db";
import log from "../utils/logger";
import { IDBClip } from "../interfaces/db/IDBClip";

/**
 * Representation of a single clip
 *
 * @class Clip
 * @implements {IDBClip}
 */
class Clip implements Partial<IDBClip> {

    public id?: number;
    public fileName?: string;
    public filePath?: string;
    public size?: number;
    public created?: number;
    public edited?: boolean;
    public instagram?: boolean;
    public twitter?: boolean;
    public facebook?: boolean;
    public reddit?: boolean;
    public youtube?: boolean;

    private static readonly COLLECTION_KEY = "clips";

    public constructor(clip: IDBClip) {
        if (!clip) {
            return;
        }

        this.id = clip.id;
        this.fileName = clip.fileName;
        this.filePath = clip.filePath;
        this.size = clip.size;
        this.created = clip.created;
        this.edited = clip.edited || false;
        this.instagram = clip.instagram || false;
        this.twitter = clip.twitter || false;
        this.facebook = clip.facebook || false;
        this.reddit = clip.reddit || false;
        this.youtube = clip.youtube || false;
    }

    /**
     * Stores a new clip
     *
     * @returns {Promise<void>}
     */
    public async create(): Promise<void> {
        try {
            await db.listAppend(Clip.COLLECTION_KEY, this);
        } catch (error) {
            log.error("[CLIP-ERROR]: excpetion occurred while attempting to create clip", error);
        }
        log.info("[CLIP]: sucessfully stored new clip", this);
    }

    /**
     * Finds a clip that satisfies a given pattern
     *
     * @static
     * @param {*} predicate
     * @returns {(Promise<Clip | undefined>)}
     */
    public static async find(predicate: any): Promise<Clip | undefined> {
        let result: Clip | undefined;
        try {
            result = await db.listFind<Clip>(Clip.COLLECTION_KEY, predicate);
        } catch (error) {
            log.error("[CLIP-ERROR]: exception occurred while attempting to find clip", error);
        }
        return result;
    }

    /**
     * Returns boolean indicated if a clip exists
     *
     * @static
     * @param {*} predicate
     * @returns {Promise<boolean>}
     */
    public static async has(predicate: any): Promise<boolean> {
        let result: Clip | undefined;
        try {
            result = await db.listFind<Clip>(Clip.COLLECTION_KEY, predicate);
        } catch (error) {
            log.error("[CLIP-ERROR]: exception occurred while attempting to find clip", error);
        }
        return result ? true : false;
    }
}

export default Clip;
