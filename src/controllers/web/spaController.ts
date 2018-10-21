import { Context } from "koa";
import Clip from "../../models/Clip";

// Require page templates
const rootSpaTemplate = require("../../view");

class SpaController {

    public async index(ctx: Context) {

        // Get all clips
        const clips = await Clip.all();

        // Stream single page application with initial state
        ctx.type = "text/html";
        ctx.body = await rootSpaTemplate.stream({ clips });
    }
}

export default SpaController;
