import * as chokidar from "chokidar";
import C from "./utils/constants";
import Clip from "./models/Clip";
import log from "./utils/logger";
import { getFileStats, getFileStatsForDirectory } from "./utils/filesystem";
import { IDBClip } from "./interfaces/db/IDBClip";

let isWatcherReady = false;

const watcher = chokidar.watch(C.CLIPS_PATH);

watcher.on("ready", async () => {
    log.info("[CHOKIDAR-WATCHER]: Initial scan complete. Ready for changes...")
    isWatcherReady = true;
    await updateStoredClips();
});

watcher.on("all", async (event: string, path: string) => {

    if (!isWatcherReady) {
        return;
    }

    log.info(`[CHOKIDAR-WATCHER]: ${event} event detected for file: ${path}`);

    if (event === "add") {

        const fileStats = await getFileStats(path);

        const clip = new Clip({
            id: fileStats.stats.ino,
            fileName: fileStats.fileName,
            filePath: fileStats.filePath,
            created: fileStats.stats.birthtimeMs,
            size: fileStats.stats.size,
            edited: false,
            facebook: false,
            instagram: false,
            reddit: false,
            twitter: false,
            youtube: false
        });

        await clip.create();
    }
});

/**
 * Updates the db with he current clips directory content, ensuring not to
 * overwrite any existing clips.
 *
 * @export
 * @returns {Promise<void>}
 */
const updateStoredClips = async (): Promise<void> => {

    log.info("[UPDATE-STORED-CLIPS] START");

    const allFileStats = await getFileStatsForDirectory(C.CLIPS_PATH);
    log.info("[FILE-STATS]", allFileStats);

    // Update db with new file info
    for (const fileStats of allFileStats) {

        // Check if clip already exists
        const uniqueId = fileStats.stats.ino;
        const hasClip = await Clip.has((c: IDBClip) => c.id === uniqueId);

        if (!hasClip) {

            const clip = new Clip({
                id: fileStats.stats.ino,
                fileName: fileStats.fileName,
                filePath: fileStats.filePath,
                created: fileStats.stats.birthtimeMs,
                size: fileStats.stats.size,
                edited: false,
                facebook: false,
                instagram: false,
                reddit: false,
                twitter: false,
                youtube: false
            });

            await clip.create();

        }
    }

    log.info("[UPDATE-STORED-CLIPS] END");
};
