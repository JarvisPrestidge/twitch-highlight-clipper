import * as envalid from "envalid";

/**
 * Imports environment variables from local .env file from development only
 *
 * @export
 * @returns {Promise<void>}
 */
export const importEnvironmentVariables = async (): Promise<void> => {
    if (process.env.NODE_ENV === "development") {
        // Conditional import
        const dotenv = await import("dotenv");
        dotenv.config();
    }
}

/**
 * Validates environment variables
 *
 * @export
 * @returns {void}
 */
export const validateEnvironmentVariables = (): void => {
    const { cleanEnv, str } = envalid;

    const validators = {
        // User data folder
        APPDATA: str()
    };

    cleanEnv(process.env, validators);
}

/**
 * Returns a concrete type for a defined environment variable
 *
 * @param {string} env
 * @returns {string}
 */
export const checkEnv = (env: string): string => {
    const value = process.env[env];
    if (!value) {
        throw new Error(`Required environment variable ${env} needs to be set.`);
    }
    return value;
}
