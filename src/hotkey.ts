import * as ioHook from "iohook";
import * as moment from "moment";
import { startReplayBuffer } from "./obs/client";

ioHook.start(false);

const CTRL = 29;
const LEFT_BRACKET = 26;

let lastShortcutDate = moment();

// ioHook.on("keydown", event => console.log(event));

ioHook.registerShortcut([CTRL, LEFT_BRACKET], async () => {

    const nowTime = moment();
    const resetTime = moment(lastShortcutDate).add("5", "seconds");
    const isWithinLastMinute = nowTime.isBefore(resetTime);

    if (isWithinLastMinute) {
        return;
    }

    lastShortcutDate = moment();

    console.log("Shortcut triggered!");

    await startReplayBuffer();

    console.log("Toggled OBS replay buffer");
});

console.log("Hook started");
