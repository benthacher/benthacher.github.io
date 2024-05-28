import { Canvas } from "../graphics/Canvas.js";
import { Mouse } from "./Mouse.js";

/**
 * @class Key
 * @classdesc Key class
 * @param {boolean} pressed
 * @param {boolean} released
 * @param {boolean} canBePressed
 * @param {boolean} canBeReleased
 */
export class Key {
    constructor() {
        this.pressed = false;
        this.released = false;
        this.canBePressed = false;
        this.canBeReleased = false;
    }
}

/**
 * CallbackMode
 * @readonly
 * @enum {number}
 */
export const CallbackMode = Object.freeze({
    HOLD: 0,
    PRESS: 1,
    RELEASE: 2
});

/**
 * @class KeyCallback
 * @classdesc Key callback class
 * @param {string} key
 * @param {function} callback
 * @param {CallbackMode} mode
 */
export class KeyCallback {
    /**
     * @param {string} key
     * @param {function} callback
     * @param {CallbackMode} mode
     */
    constructor(key, mode, callback) {
        this.key = key;
        this.mode = mode;
        this.callback = callback;
    }
}

/**
 * @class CallbackHandler
 * @classdesc Callback handler for Game
 * @param {KeyCallback[]} keyCallbacks
 * @param {Canvas} canvas Canvas to attach events to
 * @param {Object.<string, Key>} keys
 * @param {Mouse} mouse
 * @param {Function} onwheel
 */
export class CallbackHandler {
    /**
     * @param {Canvas} canvas Canvas to attach events to
     */
    constructor(canvas) {
        this.keyCallbacks = [];
        this.keys = {};
        this.canvas = canvas;
        this.elem = canvas.canvas;

        this.mouse = new Mouse(this);

        window.onmousemove = e => {
            this.mouse.event_pos.x = e.x;
            this.mouse.event_pos.y = e.y;

            this.onmousemove?.(e);
        };

        this.elem.onwheel = e => this.onwheel?.(e); // only executes onwheel if we've defined it

        this.elem.onmousedown = e => {
            this.mouse.down = true;
            this.mouse.drag = this.mouse.pos.copy();

            this.onmousedown?.(e);
        }

        this.elem.onmouseup = e => {
            this.mouse.down = false;
            this.mouse.canDrag = true;

            this.onmouseup?.(e);
        }

        this.elem.onkeydown = e => {
            if (!(e.key in this.keys))
                return;
            this.keys[e.key].pressed = true;
            this.keys[e.key].released = false;
            this.keys[e.key].canBeReleased = true;
        };

        this.elem.onkeyup = e => {
            if (!(e.key in this.keys))
                return;
            this.keys[e.key].pressed = false;
            this.keys[e.key].released = true;
            this.keys[e.key].canBePressed = true;
        };
    }
    /**
     * @param {string} key
     * @param {CallbackMode} mode
     * @param {Function} callback
     */
    attachKey(key, mode, callback) {
        this.keys[key] = new Key();

        this.keyCallbacks.push(new KeyCallback(key, mode, callback));
    }

    remove(key, mode) {
        for (let i = 0; i < this.keyCallbacks.length; i++) {
            if (this.keyCallbacks[i].key == key && this.keyCallbacks[i].mode == mode) {
                this.keyCallbacks.splice(i, 1);
            }
        }
    }

    handleCallbacks(dt) {
        this.mouse.update(dt);

        this.keyCallbacks.forEach(keyCallback => {
            switch (keyCallback.mode) {
                case CallbackMode.HOLD:
                    if (this.keys[keyCallback.key] && this.keys[keyCallback.key].pressed)
                        keyCallback.callback();
                    break;
                case CallbackMode.PRESS:
                    if (this.keys[keyCallback.key] && this.keys[keyCallback.key].pressed && this.keys[keyCallback.key].canBePressed) {
                        keyCallback.callback();
                        this.keys[keyCallback.key].canBePressed = false;
                    }
                    break;
                case CallbackMode.RELEASE:
                    if (this.keys[keyCallback.key] && this.keys[keyCallback.key].released && this.keys[keyCallback.key].canBeReleased) {
                        keyCallback.callback();
                        this.keys[keyCallback.key].canBeReleased = false;
                    }
                    break;
            }
        });

        this.update();
    }

    update() { }
}