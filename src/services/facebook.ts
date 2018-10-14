import * as moment from "moment";
import * as request from "request-promise-native";
import db from "../db/db";
import { Headers, Options } from "request";
import { sleep } from "../utils/helpers";


/**
 * Responsible for interacting with Twitch apis
 *
 * @class Twitch
 */
class Twitch {

    private accessToken?: string;
    private refreshToken?: string;

    /**
     * Responsible for fetching or refreshing tokens
     *
     * @returns
     */
    public async getAccessToken() {

        // Fetch persistent auth values
        this.accessToken = db.get("auth.accessToken").value();
        this.refreshToken = db.get("auth.refreshToken").value();

        if (!this.accessToken && !this.refreshToken) {

            // Open chrome tab
            // await launch({ startingUrl: C.TWITCH_OAUTH_ENTRY_URI });

            while (!this.accessToken || !this.refreshToken) {
                await sleep(500);
            }
        }
    }

    /**
     * Constructs an auth redirect url
     *
     * @returns {string}
     */
    public static getAuthUrl(): string {

        const baseAuthUri = "https://id.twitch.tv/oauth2/authorize?";

        const authUrl =
            baseAuthUri +
            `client_id=${"insert client id"}&` +
            `redirect_uri=${"insert redirect uri"}&` +
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
            client_id: "insert here",
            client_secret: "insert here",
            redirect_uri: "insert here",
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

        let response: any;

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
            client_id: "insert client id",
            client_secret: "insert client sercret",
            redirect_uri: "insert redirect uri",
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

        let response: any;

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

        let response: any;

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
