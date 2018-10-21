import { importEnvironmentVariables, validateEnvironmentVariables } from "./utils/environment";

// Initialize environment variables
importEnvironmentVariables();
validateEnvironmentVariables();

// Initialize database
(async () => {
    const db = await import("./db/db");
    await db.default.init();
})();

// Initialize Advanced module bundler, asset pipeline and optimizer
import "./lasso";

// Initialize Server
import "./server";

