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
}

export default Constants;
