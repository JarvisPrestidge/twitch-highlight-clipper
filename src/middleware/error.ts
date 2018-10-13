import { Context } from "koa";

type koaNext = () => Promise<any>;

export const errorHandler = async (ctx: Context, next: koaNext) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        if (ctx.status === 401) {
            // Send user to re-authenticate
            ctx.redirect("/login");
        }
        ctx.app.emit("error", err, ctx);
        ctx.type = "application/json";
        ctx.body = { error: { message: err.message, status: ctx.status } };
    }
};
