import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

import * as ioHook from "iohook";
import Twitch from "./apis/twitch";
import db from "./db";

ioHook.start(false);

const CTRL = 29;
const I = 73;

ioHook.registerShortcut([CTRL, I], (keys: any) => {
    console.log("Shortcut pressed with keys:", keys);

    const twitch = new Twitch();

    const createClipUrl = twitch.createClip();

    console.log(createClipUrl);


    await db
        .get("posts")
        .push({ id: 1, title: "lowdb is awesome" })
        .write();
});

console.log("Hook started. Try type something or move mouse");
