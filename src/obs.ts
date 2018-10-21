import log from "./utils/logger";
const OBSWebSocket = require("obs-websocket-js");
const obs = new OBSWebSocket();

// On connection event
obs.onConnectionOpened(() => log.info("[OBS] websocket connection opened"));

// On error event
obs.on("error", (err: any) => log.error("[OBS-ERROR] socket error:", err));

/**
 * Start the replay buffer
 */
export const startReplayBuffer = async () => {
    const response = await obs.StartReplayBuffer();
    log.info("[OBS-START-REPLAY-BUFFER] started replay buffer", response);
};

/**
 * Stop the replay buffer
 */
export const stopReplayBuffer = async () => {
    const response = await obs.StopReplayBuffer();
    log.info("[OBS-STOP-REPLAY-BUFFER] stopped replay buffer", response);
};

/**
 * Save a replay
 */
export const saveReplayBuffer = async () => {
    try {
        const response = await obs.SaveReplayBuffer();
        log.info("[OBS-SAVE-REPLAY-BUFFER] saved replay buffer", response);
    } catch (err) {
        log.error("[OBS-ERROR] failed to save replay buffer:", err);
    }
};

/**
 * Attempts to connect to OBS while handling possible exceptions
 *
 * @returns {Promise<void>}
 */
const connectToOBS = async (): Promise<void> => {
    try {
        await obs.connect();
    } catch (err) {
        log.error("[OBS-ERROR] failed connection attempt:", err);
    }
};

export default connectToOBS();
