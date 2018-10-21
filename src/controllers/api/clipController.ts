import { Context } from "koa";
import Clip from "../../models/Clip";

/**
 * Handles clip routing logic
 *
 * @class ClipController
 */
class ClipController {

    /**
     * Returns all stored clips
     *
     * @param {Context} ctx
     */
    public async all(ctx: Context) {
        try {
            const clips = await Clip.all();
            ctx.body = clips;
        } catch (error) {
            console.log(error);
            ctx.throw(400, "INVALID_DATA");
        }
    }

    /**
     * Returns all stored clips
     *
     * @param {Context} ctx
     */
    public async update(ctx: Context) {
        try {
            const clips = await Clip.all();
            ctx.body = clips;
        } catch (error) {
            console.log(error);
            ctx.throw(400, "INVALID_DATA");
        }
    }

    /**
     * Returns all stored clips
     *
     * @param {Context} ctx
     */
    public async process(ctx: Context) {
        try {
            const clips = await Clip.all();
            ctx.body = clips;
        } catch (error) {
            console.log(error);
            ctx.throw(400, "INVALID_DATA");
        }
    }
}

export default ClipController;
