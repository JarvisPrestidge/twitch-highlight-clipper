import * as Koa from "koa";
import * as serve from "koa-static";
import * as logger from "koa-logger";
import log from "./utils/logger";

// Required before importing Marko templates
require("marko/node-require");

// TODO: add api routes
// import api from "./routes/api/api";
// TODO: add spa routes
// import spa from "./routes/web/spa";

// Create new koa webserver instance
const app = new Koa();

// Add logging middleware
app.use(logger());


// Add stats routing
// TODO: use routes
// app.use(api.routes());
// app.use(api.allowedMethods());

// Serve static files
app.use(serve(__dirname + "/static"));
// Start server

app.listen(() => log.info("listening on port 5000..."));
