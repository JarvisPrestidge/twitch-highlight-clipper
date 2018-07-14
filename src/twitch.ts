import * as Koa from "koa";
import * as moment from "moment";
import * as request from "request-promise-native";
import * as Router from "koa-router";
import C from "./constants";
import db from "./db";
import { Context } from "koa";
import { Headers, Options } from "request";
import { ITwitchCreateClipResponse } from "./interfaces/ITwitchCreateClipResponse";
import { ITwitchTokenResponse } from "./interfaces/ITwitchTokenResponse";
import { launch } from "chrome-launcher";
import { Server } from "http";
import { sleep } from "./utils/helpers";


type Moment = moment.Moment;

/**
 * Responsible for interacting with Twitch apis
 *
 * @class Twitch
 */
class Twitch {

    private accessToken?: string;
    private refreshToken?: string;
    private expiry?: Moment;
    private server?: Server;

    /**
     * Responsible for fetching or refreshing tokens
     *
     * @returns
     */
    public async getAccessToken() {

        // Fetch persistent auth values
        this.accessToken = db.get("auth.accessToken").value();
        this.refreshToken = db.get("auth.refreshToken").value();
        this.expiry = moment(db.get("auth.expiry").value());

        if (!this.accessToken || !this.refreshToken) {

            // Create a server to handle the OAuth flow
            this.initOAuthServer();

            // Open chrome tab
            await launch({ startingUrl: C.TWITCH_OAUTH_ENTRY_URI });

            while (!this.accessToken || !this.refreshToken) {
                await sleep(500);
            }

            if (this.server) {
                this.server = undefined;
            }

            return;
        }

        if (this.accessToken &&
            this.refreshToken &&
            (this.expiry && moment().isAfter(this.expiry.subtract(8, "hours")))
        ) {
            this.refreshAccessToken();
        }

        return;
    }

    /**
     * Initiate a Koa server instance to handle the initial OAuth flow
     *
     * @returns {Server}
     */
    private initOAuthServer(): void {

        const app = new Koa();

        const twitch = new Twitch();

        const router = new Router();

        router.get("/auth", async (ctx: Context) => {
            const twitchAuthUrl = twitch.getAuthUrl();
            ctx.redirect(twitchAuthUrl);
        });

        router.get("/oauth-redirect", async (ctx: Context) => {
            const code = ctx.query.code;
            await this.exchangeCodeForToken(code);
        });

        // Get routes and serve
        app.use(router.routes());

        app.listen(4000, () => console.log("\nServer started, listening on port 4000..."));

        this.server = app as any;
    }

    /**
     * Constructs an auth redirect url
     *
     * @returns {string}
     */
    public getAuthUrl(): string {

        const baseAuthUri = "https://id.twitch.tv/oauth2/authorize?";

        const authUrl =
            baseAuthUri +
            `client_id=${C.TWITCH_CLIENT_ID}&` +
            `redirect_uri=${C.TWITCH_REDIRECT_URI}&` +
            "response_type=code&" +
            "scope=clips:edit";

        return encodeURI(authUrl);
    }

    /**
     * Exchanges an auth code for an access token
     *
     * @param {string} code
     * @returns {Promise<ITwitchTokenResponse>}
     */
    public async exchangeCodeForToken(code: string): Promise<string> {

        const uri = "https://id.twitch.tv/oauth2/token";

        const qs: any = {
            client_id: C.TWITCH_CLIENT_ID,
            client_secret: C.TWITCH_CLIENT_SECRET,
            redirect_uri: C.TWITCH_REDIRECT_URI,
            grant_type: "authorization_code",
            code
        };

        const options: Options = {
            uri,
            method: "POST",
            qs,
            gzip: true,
            json: true
        };

        let response: ITwitchTokenResponse;

        try {
            response = await request(options);
        } catch (err) {
            throw new Error(`Failed to retrieve Twitch access token: ${err.message}`);
        }

        const accessToken = response.access_token;
        const refreshToken = response.refresh_token;
        const expiry = moment().add(response.expires_in, "seconds");

        // Persist auth values
        db.set("auth.accessToken", accessToken).write()
        db.set("auth.refreshToken", refreshToken).write()
        db.set("auth.expiry", expiry.toISOString()).write()

        // Add to class instance
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiry = expiry;

        return accessToken;
    }

    /**
     * Attempt to refresh access token
     *
     * @returns {Promise<ITwitchTokenResponse>}
     */
    public async refreshAccessToken(): Promise<string> {

        const uri = "https://id.twitch.tv/oauth2/token";

        const qs: any = {
            client_id: C.TWITCH_CLIENT_ID,
            client_secret: C.TWITCH_CLIENT_SECRET,
            redirect_uri: C.TWITCH_REDIRECT_URI,
            grant_type: "refresh_token",
            refresh_token: this.refreshToken
        };

        const options: Options = {
            uri,
            method: "POST",
            qs,
            gzip: true,
            json: true
        };

        let response: ITwitchTokenResponse;

        try {
            response = await request(options);
        } catch (err) {
            throw new Error(`Failed to refresh Twitch access token: ${err.message}`);
        }

        const accessToken = response.access_token;
        const refreshToken = response.refresh_token;
        const expiry = moment().add(response.expires_in, "seconds");

        // Persist auth values
        db.set("auth.accessToken", accessToken).write()
        db.set("auth.refreshToken", refreshToken).write()
        db.set("auth.expiry", expiry.toISOString()).write()

        // Add to class instance
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiry = expiry;

        return accessToken;
    }

    /**
     * Fetches an edit url to create a new clip
     *
     * @returns {Promise<string>}
     */
    public async createClip(): Promise<string> {

        if (!this.accessToken) {
            await this.getAccessToken();
        }

        const uri = "https://api.twitch.tv/helix/clips";

        const headers: Headers = {
            Authorization: `Bearer ${this.accessToken}`
        };

        const channelId = process.env.TWITCH_CHANNEL_ID;

        if (!channelId) {
            throw new Error("Invalid channel id environment variable");
        }

        const qs: any = {
            broadcaster_id: channelId,
            has_delay: true
        };

        const options: Options = {
            uri,
            method: "POST",
            headers,
            qs,
            gzip: true,
            json: true
        };

        let response: ITwitchCreateClipResponse;

        try {
            response = await request(options);
        } catch (err) {
            throw new Error(`Failed to create new clip: ${err.message}`);
        }

        if (!response.data.length) {
            throw new Error("Failed to create new clip edit url");
        }

        const clipCreationUrl = response.data[0].edit_url;

        return clipCreationUrl;
    }
}

export default Twitch;
