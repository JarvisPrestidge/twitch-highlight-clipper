import { createLogger, format, transports } from "winston";
import { existsSync, mkdirSync } from "fs";
import C from "../constants";

if (!existsSync(C.LOG_PATH)) {
  mkdirSync(C.LOG_PATH);
}

const alignedWithColorsAndTime = format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.prettyPrint()
);

const logger = createLogger({
    transports: [
        new transports.Console({
            level: process.env.NODE_ENV === "production" ? "error" : "debug",
            handleExceptions: true,
            format: alignedWithColorsAndTime
        }),
        new transports.File({
            filename: "debug.log",
            level: "info",
            format: alignedWithColorsAndTime,
            handleExceptions: true
        })
    ],
    exitOnError: false
});

if (process.env.NODE_ENV !== "production") {
    logger.info("Logging initialized at debug level");
} else {
    logger.info("Logging initialized at error level");
}

export default logger;
