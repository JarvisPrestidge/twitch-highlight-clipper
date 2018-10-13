import { join } from "path";

/**
 * Project Constants
 *
 * @class Constants
 */
class Constants {

    /**
     * Environment variable defined helper
     *
     * @private
     * @static
     */
    private static checkEnv = (env: string): string => {
        const value = process.env[env];
        if (!value) {
            throw new Error(`Required environment variable ${env} needs to be set.`);
        }
        return value;
    };

    // Paths
    public static readonly DB_PATH = join(__dirname, "..", "db", "db.json");
    public static readonly LOG_PATH = join(__dirname, "..", "logs");

    // Values
    public static readonly TWITCH_CHANNEL_ID = Constants.checkEnv("TWITCH_CHANNEL_ID");
}

export default Constants;
