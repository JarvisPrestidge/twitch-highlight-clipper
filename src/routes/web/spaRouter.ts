import * as Router from "koa-router";
import { Context } from "koa";
import SpaController from "../../controllers/web/spaController";

// Create router instance
const router = new Router();

const spaController = new SpaController();

// Default route
router.get("/", (ctx: Context) => {
    return ctx.redirect("/home");
});

// Route for index page
router.get("/home", async (ctx: Context) => {
    await spaController.index(ctx);
});

export default router;
