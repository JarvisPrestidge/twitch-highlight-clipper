import { join } from "path";
/**
 * Project Constants
 *
 * @class Constants
 */
class Constants {
    // Paths
    public static readonly ROOT_PATH = join(__dirname, "..");
    public static readonly DB_PATH = join(__dirname, "..", "db", "db.json");

    // Values
    public static readonly TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    public static readonly TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
    public static readonly TWITCH_CHANNEL_ID = process.env.TWITCH_CHANNEL_ID;

    // URIs
    public static readonly TWITCH_OAUTH_ENTRY_URI = "http://localhost:4000/auth";
    public static readonly TWITCH_REDIRECT_URI = "http://localhost:4000/oauth-redirect";
}

export default Constants;
