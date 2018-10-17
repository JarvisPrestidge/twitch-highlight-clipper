
/**
 * Represents a single clip
 *
 * @export
 * @interface IDBClip
 */
export interface IDBClip {
    fileName: string;
    filePath: string;
    size: number;
    created: number;
    edited: boolean;
    instagram: boolean;
    twitter: boolean;
    facebook: boolean;
    reddit: boolean;
    youtube: boolean;
}
