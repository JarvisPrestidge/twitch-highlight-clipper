import C from "./constants";
import * as winston from "winston";
import { join } from "path";
import { createDirectory } from "./filesystem";

// Create log directory if doesn't exist
(async () => await createDirectory(C.LOG_PATH))();

/**
 * Formats the meta object if passed
 *
 * @param {object} meta
 * @returns
 */
const metaFormatter = (meta: object) => {
    const hasValues = Object.keys(meta).length > 0;
    return hasValues ? `\n${JSON.stringify(meta, null, 4)}` : "";
};

const consoleFormatter = winston.format.combine(
    winston.format.align(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf((info) => {
        const { level, message, timestamp, ...meta } = info;
        return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${metaFormatter(meta)}`;
    })
);

const fileFormatter = winston.format.combine(
    winston.format.align(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf((info) => {
        const { level, message, timestamp, ...meta } = info;
        return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${metaFormatter(meta)}`;
    })
);

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "debug",
            handleExceptions: true,
            format: consoleFormatter
        }),
        new winston.transports.File({
            filename: join(C.LOG_PATH, "info.log"),
            level: "info",
            handleExceptions: true,
            format: fileFormatter
        })
    ]
});

logger.info("Winston logger initialized");
logger.info(`Logging to ${C.LOG_PATH}`);

export default logger;
