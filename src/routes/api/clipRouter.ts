import * as Router from "koa-router";
import ClipController from "../../controllers/api/clipController";
import { Context } from "koa";

const router = new Router();

const clipController = new ClipController();

router.get("/api/v1/clips", async (ctx: Context) => {
    await clipController.all(ctx);
});

router.post("/api/v1/clips/:id/update", async (ctx: Context) => {
    await clipController.update(ctx);
});

router.post("/api/v1/clips/:id/process", async (ctx: Context) => {
    await clipController.process(ctx);
});

export default router;
