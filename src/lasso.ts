import * as lasso from "lasso";
import C from "./utils/constants";

// Required before importing Marko templates
require("marko/node-require").install();

// Require marko plugin
const lassoMarkoPlugin = require("lasso-marko");

// Configure bundler
lasso.configure({
    outputDir: C.STATIC_PATH,
    urlPrefix: "./",
    minify: true,
    fingerprintsEnabled: true,
    bundlingEnabled: true,
    plugins: [ lassoMarkoPlugin ]
});
