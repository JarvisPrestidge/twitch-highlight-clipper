/**
 * Represents the response structure of the Twitch OAuth Client Credentials Flow
 *
 * @export
 * @interface ITwitchOAuthResponse
 */
export interface ITwitchOAuthResponse {
    access_token: string;
    expires_in: number;
    scope: string[];
}
