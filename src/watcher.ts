import db from "./db/db";
import C from "./utils/constants";
import log from "./utils/logger";
import * as chokidar from "chokidar";
import { getFileStatsForDirectory } from "./utils/filesystem";
import { IDBClip } from "./interfaces/db/IDBClip";

const watcher = chokidar.watch(C.CLIPS_PATH);


watcher.on("ready", async () => {
    log.info("[WATCHER] Initial scan complete. Ready for changes...")

    await updateStoredClips();
});

watcher.on("all", (event: string, path: string) => {
    log.info(`[WATCHER] ${event} event detected for file: ${path}`);
});

/**
 * Updates the db
 *
 * @export
 */
export const updateStoredClips = async () => {

    log.info("[UPDATE-STORED-CLIPS] START");

    const allFileStats = await getFileStatsForDirectory(C.CLIPS_PATH);
    log.info("[FILE-STATS]", allFileStats);

    const clips: IDBClip[] = db.get("clips").value();

    // Update db with new file info
    for (const fileStats of allFileStats) {

        // Check if clip already exists
        const clipExists = clips.some((clip) => clip.fileName === fileStats.fileName);

        if (!clipExists) {

            // Create new  clip
            const newClip: IDBClip = {
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
            };

            db.get("clips").push(newClip).write();
        }
    }

    log.info("[UPDATE-STORED-CLIPS] END");
};
