/**
 * Sleep for x milliseconds
 *
 * @param {number} ms
 * @returns
 */
export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
