import * as Koa from "koa";
import * as logger from "koa-logger";
import * as serve from "koa-static";
import C from "./utils/constants";
import clips from "./routes/api/clipRouter";
import log from "./utils/logger";
import spa from "./routes/web/spaRouter";

// Required before importing Marko templates
require("marko/node-require");

// Create new koa webserver instance
const app = new Koa();

// Add logging middleware
app.use(logger());

// Add stats routing
app.use(clips.routes());
app.use(clips.allowedMethods());

app.use(spa.routes());
app.use(spa.allowedMethods());

// Serve static files
app.use(serve(C.STATIC_PATH));
// Start server

app.listen(5000, () => log.info("listening on port 5000..."));
