import * as Koa from "koa";
import * as logger from "koa-logger";
import * as serve from "koa-static";
import C from "./utils/constants";
import clipRouter from "./routes/api/clipRouter";
import log from "./utils/logger";
import spaRouter from "./routes/web/spaRouter";

// Create new koa webserver instance
const app = new Koa();

// Add logging middleware
app.use(logger());

// Add clip api routing
app.use(clipRouter.routes());
app.use(clipRouter.allowedMethods());

// Add main spa routing
app.use(spaRouter.routes());
app.use(spaRouter.allowedMethods());

// Serve static files
app.use(serve(C.STATIC_PATH));

// Start server
app.listen(5000, () => log.info("listening on port 5000..."));
