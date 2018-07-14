/**
 * Represents the token response object after exchanging an auth code
 *
 * @export
 * @interface ITwitchTokenResponse
 */
export interface ITwitchTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string[];
}
