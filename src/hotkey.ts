import * as ioHook from "iohook";
import * as moment from "moment";
import log from "./utils/logger";
// import { startReplayBuffer } from "./obs";

ioHook.start(false);

const CTRL = 29;
const LEFT_BRACKET = 26;

let lastShortcutDate = moment();

ioHook.registerShortcut([CTRL, LEFT_BRACKET], async () => {

    const nowTime = moment();
    const resetTime = moment(lastShortcutDate).add("5", "seconds");
    const isWithinLastMinute = nowTime.isBefore(resetTime);

    if (isWithinLastMinute) {
        return;
    }

    lastShortcutDate = moment();

    const a = { test: "hello", age: 21 };


    log.info("Shortcut triggered!");

    // await startReplayBuffer();

    log.info("Toggled OBS replay buffer", a);
});

log.debug("Keyboard Hook started. Listening for hokeys...");
