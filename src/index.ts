import * as dotenv from "dotenv";
// Load environment variables
dotenv.config();

import Twitch from "./twitch";
import * as ioHook from "iohook";
import db from "./db";
import * as moment from "moment";
import { sleep } from "./utils/helpers";

const twitch = new Twitch();

twitch.getAccessToken();

ioHook.start(false);

const CTRL = 29;
const U = 22;

let lastShortcutDate = moment();

ioHook.registerShortcut([CTRL, U], async () => {

    const isWithinLast30Seconds = moment().isBefore(moment(lastShortcutDate).add("30", "seconds"));
    if (isWithinLast30Seconds) {
        return;
    }

    lastShortcutDate = moment();

    console.log("Shortcut triggered!");

    await sleep(5000);

    const createClipUrl = await twitch.createClip();

    console.log(createClipUrl);

    const nowDate = moment().toISOString();

    db
        .get("clips")
        .push({ url: createClipUrl, edited: false, createdAt: nowDate })
        .write();

    console.log("Written to db");
});

console.log("Hook started. Try type something or move mouse");
