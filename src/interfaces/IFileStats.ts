import { Stats } from "fs";

/**
 * Represents files and their stats within a directory
 *
 * @export
 * @interface IFileStats
 */
export interface IFileStats {
    fileName: string;
    filePath: string;
    stats: Stats;
}
