import { importEnvironmentVariables, validateEnvironmentVariables } from "./utils/environment";

// Initialize environment variables
importEnvironmentVariables();
validateEnvironmentVariables();

import db from "./db/db";

// Initialize database
(async () => db.init())();
