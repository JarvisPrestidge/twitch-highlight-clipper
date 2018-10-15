import { exists, mkdir, readdir, stat } from "fs";
import { IFileStats } from "../interfaces/IFileStats";
import { promisify } from "util";

const statAsync = promisify(stat);
const existsAsync = promisify(exists);
const readdirAsync = promisify(readdir);
const mkdirAsync: any = promisify(mkdir);

/**
 * Create directory if doesn't exist
 *
 * @export
 * @param {string} path
 * @returns {Promise<void>}
 */
export const createDirectory = async (path: string): Promise<void> => {
    const directoryExists = await existsAsync(path);
    if (!directoryExists) {
        return await mkdirAsync(path, { recursive: true });
    }
};


/**
 * Get stats for all files within a directory
 *
 * @export
 * @param {string} path
 * @returns {Promise<IFileStats[]>}
 */
export const getFileStatsForDirectory = async (path: string): Promise<IFileStats[]> => {
    const directoryFileStats: IFileStats[] = [];
    const files = await readdirAsync(path);
    for (const file of files) {
        const stats = await statAsync(file);
        const isFile = stats.isFile();
        if (isFile) {
            directoryFileStats.push({ file, stats });
        }
    }
    return directoryFileStats;
};
