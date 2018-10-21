import "./init";

/**
 * Main application entry point
 *
 * @returns {Promise<void>}
 */
const application = async (): Promise<void> => {

    await import("./obs");
    await import("./voice");
    await import("./watcher");

};


application();
