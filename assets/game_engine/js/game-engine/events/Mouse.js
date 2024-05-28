import { Vector } from "../util/Vector.js"
import { CallbackHandler } from "./CallbackHandler.js";

/**
 * @class Mouse
 * @classdesc Mouse class
 * @param {Vector} pos
 * @param {Vector} vel
 * @param {Vector} drag
 * @param {Vector} draggingVec
 * @param {boolean} canDrag
 * @param {boolean} down
 * @param {number} zoom_x
 * @param {CallbackHandler} callbackHandler
 */
export class Mouse {
    /**
     * @param {CallbackHandler} callbackHandler
     */
    constructor(callbackHandler) {
        this.event_pos = new Vector(0, 0);

        this.pos = new Vector(0, 0);
        this.prevPos = new Vector(0, 0);
        this.vel = new Vector(0, 0);
        this.drag = new Vector(0, 0);
        this.draggingVec = new Vector(0, 0);
        this.canDrag = true;
        this.down = false;
        this.callbackHandler = callbackHandler;
        this.zoom_x = 1 / callbackHandler.canvas.camera.zoom;

        const bounds = callbackHandler.elem.getBoundingClientRect?.();

        if (bounds)
            this.screenOffset = new Vector(bounds.left, bounds.top);
        else
            this.screenOffset = new Vector(0, 0); // assume that element is window/document, offset is zero
    }
    /**
     *
     * @param {Vector} vec
     * @param {boolean} invert
     */
    dragVector(vec, invert) {
        if (this.down) {
            if (this.canDrag) {
                this.draggingVec = vec.copy();
                this.canDrag = false;
            }
            vec.set(
                this.draggingVec.copy()
                    .subtract(this.drag.copy()
                        .subtract(this.pos)
                        .scale(1 / this.callbackHandler.canvas.camera.zoom)
                        .scale(invert ? -1 : 1)));
        }
    }
    /**
     * Meant to be used as onwheel for the callbackHandler
     * @returns Callback function
     */
    zoomToPos() {
        return e => {
            const camera = this.callbackHandler.canvas.camera;
            this.zoom_x = Math.max(0.002, this.zoom_x + (e.deltaY / 2001000));

            const delta = 1 / (this.zoom_x * camera.zoom)
            const deltaVec = this.callbackHandler.canvas.calcMapCoords(this.event_pos).subtract(camera.pos).scale(1 - delta);

            camera.zoom = 1 / this.zoom_x;
            camera.pos.subtract(deltaVec, true);
        };
    }

    update(dt) {
        this.pos.set(this.event_pos.copy().subtract(this.screenOffset));

        this.vel.set(this.pos.copy().subtract(this.prevPos).scale(1 / (this.callbackHandler.canvas.camera.zoom * dt)));

        this.prevPos.set(this.pos);
    }
}