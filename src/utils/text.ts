import { StringDecoder } from "string_decoder";

/**
 * Converts an array buffer to a string while trimming whitespace
 *
 * @param {Buffer} buffer
 * @returns {string}
 */
export const decodeText = (buffer: Buffer): string => {
    const textDecoder = new StringDecoder("utf-8");
    const text = textDecoder.end(buffer);
    return text.trim();
};
