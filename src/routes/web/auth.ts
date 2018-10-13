import twitch from "./twitch";
import { Context } from "koa";

const app = new Koa();

const router = new Router();

router.get("/auth", async (ctx: Context) => {
    const twitchAuthUrl = twitch.getAuthUrl();
    ctx.redirect(twitchAuthUrl);
});

router.get("/oauth-redirect", async (ctx: Context) => {
    const code = ctx.query.code;
    await this.exchangeCodeForToken(code);
});

// Get routes and serve
app.use(router.routes());

app.listen(4000, () => console.log("\nServer started, listening on port 4000..."));
