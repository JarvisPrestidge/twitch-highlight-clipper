import * as moment from "moment";
import * as request from "request-promise-native";
import C from "../constants";
import { Headers, Options } from "request";
import { ITwitchCreateClipResponse } from "../interfaces/ITwitchCreateClipResponse";
import { ITwitchOAuthResponse } from "../interfaces/ITwitchOAuthResponse";

type Moment = moment.Moment;

/**
 * Responsible for interacting with Twitch apis
 *
 * @class Twitch
 */
class Twitch {

    private accessToken?: string;
    private accessTokenExpiry?: Moment;

    /**
     * Responsible for retrieving access token
     *
     * @returns {Promise<string>}
     */
    private async getAccessToken(): Promise<void> {

        const uri = "https://id.twitch.tv/oauth2/token";

        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error("Invalid client id or client secret environment variables");
        }

        const qs: any = {
            client_id: clientId,
            client_secret: clientSecret,
            scope: "clips:edit",
            grant_type: "client_credentials",
        };

        const options: Options = {
            uri,
            method: "POST",
            qs,
            gzip: true,
            json: true
        };

        let response: ITwitchOAuthResponse;

        try {
            response = await request(options);
        } catch (err) {
            throw new Error(`Failed to retrieve Twitch access token: ${err.message}`);
        }

        const accessToken = response.access_token;
        const expiry = moment().add(response.expires_in, "seconds");

        this.accessToken = accessToken;
        this.accessTokenExpiry = expiry;
    }

    /**
     * Fetches an edit url to create a new clip
     *
     * @returns {Promise<string>}
     */
    public async createClip(): Promise<string> {

        if (!this.accessToken || !this.accessTokenExpiry || this.accessTokenExpiry.isAfter()) {
            await this.getAccessToken();
        }

        const uri = "https://api.twitch.tv/helix/clips";

        const headers: Headers = {
            "Authorization": `bearer ${this.accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const channelId = process.env.TWITCH_CHANNEL_ID;

        if (!channelId) {
            throw new Error("Invalid channel id environment variable");
        }

        const qs: any = {
            broadcaster_id: channelId
        };

        const options: Options = {
            uri,
            method: "GET",
            headers,
            qs,
            gzip: true,
            json: true,

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
