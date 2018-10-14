import { join } from "path";
import { checkEnv } from "./environment";

/**
 * Project wide constants
 *
 * @class Constants
 */
class Constants {

    // Meta
    public static readonly APP_NAME = "Twitch Highlight Clipper";

    // Paths
    public static readonly PROJECT_ROOT = join(__dirname, "..", "..");
    public static readonly PYTHON_PATH = join(Constants.PROJECT_ROOT, "python");
    public static readonly DB_PATH = join(checkEnv("APPDATA"), Constants.APP_NAME, "db");
    public static readonly LOG_PATH = join(checkEnv("APPDATA"), Constants.APP_NAME, "logs");

    // Values
    // public static readonly <insert value> = checkEnv("insert value");
}

export default Constants;
