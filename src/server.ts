import * as Koa from "koa";
import * as serve from "koa-static";
import * as body from "koa-bodyparser";
import * as logger from "koa-logger";

import { errorHandler } from "./middleware/error"

// Required before importing Marko templates
require("marko/node-require");

import authRouter from "./routes/web/auth";
import merchantApi from "./routes/api/merchant";
import classifierRouter from "./routes/web/classifier";
import statsRouter from "./routes/web/stats";
import testApi from "./routes/api/test";
import { Server } from "net";

const ENABLE_SSL = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT || "5000", 0);

// Create new koa webserver instance
const app = new Koa();

// Add logging middleware
app.use(logger());

// Add error hander middleware
app.use(errorHandler);

// Add body parsing
app.use(body({ enableTypes: ["json"] }));

// Passport.js
app.use(passport.initialize());

// Add auth routing
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

// Add api routing
app.use(merchantApi.routes());
app.use(merchantApi.allowedMethods());

// Add test routing
app.use(testApi.routes());
app.use(testApi.allowedMethods());

// Add classifier routing
app.use(classifierRouter.routes());
app.use(classifierRouter.allowedMethods());

// Add stats routing
app.use(statsRouter.routes());
app.use(statsRouter.allowedMethods());

// Serve static files
app.use(serve(__dirname + "/static"));
// Start server

let server: Server;
if (ENABLE_SSL) {
    const sslKey = process.env.SSL_KEY;
    const sslCert = process.env.SSL_CERT;
    if (!sslKey || !sslCert) {
        throw new Error("Invalid SSL certificate");
    }
    const options = {
        key: Buffer.from(sslKey, "base64").toString(),
        cert: Buffer.from(sslCert, "base64").toString()
    };
    server = https
        .createServer(options, app.callback())
        .listen(PORT, () => {
            console.info(`HTTPS Server started on ${PORT}`)
        });
} else {
    server = app
        .listen(PORT, () => {
            console.info(`HTTP Server started on ${PORT}`)
        });
}

server.on("close", () => {
    console.info("Server closed");
});
