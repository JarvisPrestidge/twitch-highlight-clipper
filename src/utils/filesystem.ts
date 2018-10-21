import { exists, mkdir, readdir, stat } from "fs";
import { IFileStats } from "../interfaces/IFileStats";
import { join, basename } from "path";
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
export const getFileStatsForDirectory = async (directoryPath: string): Promise<IFileStats[]> => {
    const directoryFileStats: IFileStats[] = [];
    const fileNames = await readdirAsync(directoryPath);
    for (const fileName of fileNames) {
        const filePath = join(directoryPath, fileName)
        const stats = await statAsync(filePath);
        const isFile = stats.isFile();
        if (isFile) {
            directoryFileStats.push({ fileName, filePath, stats });
        }
    }
    return directoryFileStats;
};

/**
 * Get stats for a single file
 *
 * @export
 * @param {string} filePath
 * @returns {Promise<IFileStats>}
 */
export const getFileStats = async (filePath: string): Promise<IFileStats> => {
    const stats = await statAsync(filePath);
    const fileName = basename(filePath);
    const fileStats: IFileStats = {
        fileName,
        filePath,
        stats
    };
    return fileStats;
};
