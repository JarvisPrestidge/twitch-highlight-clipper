const OBSWebSocket = require("obs-websocket-js");
const obs = new OBSWebSocket();

// Declare some events to listen for.
obs.onConnectionOpened(async () => {
    console.log("Connection Opened");

    const data = await obs.getSceneList();
    console.log(data);
});

obs.connect();

/**
 * Start the replay buffer
 */
export const startReplayBuffer = async () => {
    const response = await obs.StartReplayBuffer();
    console.log(response);
};

/**
 * Stop the replay buffer
 */
export const stopReplayBuffer = async () => {
    const response = await obs.StopReplayBuffer();
    console.log(response);
};

/**
 * Save a replay
 */
export const saveReplayBuffer = async () => {
    const response = await obs.SaveReplayBuffer();
    console.log(response);
};
