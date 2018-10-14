import C from "./utils/constants";
import log from "./utils/logger";
import { ChildProcess, spawn } from "child_process";
import { decodeText } from "./utils/text";
import { join } from "path";
import { saveReplayBuffer } from "./obs";
import moment = require("moment");

/**
 * Encapsulates an inter-process connection to a python wakeword / hotkey
 * detection implementation.
 *
 * @class Wakeword
 */
class Wakeword {

    private child: ChildProcess;
    private isListening = false;
    private listeningStartSeconds = 0;

    constructor() {
        this.child = this.start();
    }

    /**
     * Starts the wakeword python child process
     */
    public start = () => {

        log.info("[WAKEWORD-START]: starting...");

        const wakewordPath = join(C.PYTHON_PATH, "wakeword.py");

        const wakewordProcess = spawn("python", [ wakewordPath ]);

        wakewordProcess.stdout.on("data", async (data: Buffer) => {
            const text = decodeText(data)
            await this.handleKeyword(text);
        });

        log.info("[WAKEWORD-START]: successfully started");

        return wakewordProcess;
    }

    /**
     * Handle the incoming keywords from wakeword
     *
     * @private
     * @param {string} keyword
     * @returns {Promise<void>}
     */
    private async handleKeyword(keyword: string): Promise<void> {
        // Wakeword
        if (keyword === "sus bot") {
            this.isListening = true;
            this.listeningStartSeconds = moment.now();
            log.info(`[WAKEWORD-TRIGGERED] now waiting for voice commands...`);
            return;
        }

        // If we're not listening for voice commands then exit
        if (!this.isListening) {
            log.info(`[WAKEWORD-VOICE-COMMAND] voice command ignored, waiting on wakeword`);
            return;
        }

        // If we're past the wakeword threshold then exit
        const WAKE_THRESHOLD_MILLISECONDS = 5000;
        const isOverWakeThreshold = (moment.now() - this.listeningStartSeconds) > WAKE_THRESHOLD_MILLISECONDS;
        if (isOverWakeThreshold) {
            log.info(`[WAKEWORD-VOICE-COMMAND] voice command ignored, over 3 second wake threshold`);
            this.isListening = false;
            return;
        }

        // Voice commands
        if (keyword === "clip it") {
            this.isListening = false;
            log.info(`[WAKEWORD-VOICE-COMMAND] successfully detected: ${keyword}`);
            return await saveReplayBuffer();
        }
        if (keyword === "cross hair") {
            // TODO: tmi chat bot command
            this.isListening = false;
            log.info(`[WAKEWORD-VOICE-COMMAND] successfully detected: ${keyword}`);
            log.info("Need to implement")
        }
};

    /**
     * Kill the wakeword python child process
     */
    public stop = (): void => {

        log.info("[WAKEWORD-LISTEN-STOP]: stopping...");

        this.child.kill();

        log.info("[WAKEWORD-LISTEN-STOP]: successfully stopped");
    }
};

export default Wakeword;
