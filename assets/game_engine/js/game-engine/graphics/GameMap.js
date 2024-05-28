import { Vector } from "../util/Vector.js";

/**
 * @type {GameMap} Game Map object
 */

export class GameMap {
    /**
     * @param {number} width
     * @param {number} height
     * @param {string} color
     */
    constructor(width, height, color) {
        this.resize(width, height);

        this.color = color;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;

        this.bounds = {
            top: [
                new Vector(width, 0),
                new Vector(width, 0),
                new Vector(0, 0),
                new Vector(0, 0)
            ],
            bottom: [
                new Vector(width, height),
                new Vector(width, height),
                new Vector(0, height),
                new Vector(0, height)
            ],
            left: [
                new Vector(0, 0),
                new Vector(0, height),
                new Vector(0, height),
                new Vector(0, 0)
            ],
            right: [
                new Vector(width, 0),
                new Vector(width, height),
                new Vector(width, height),
                new Vector(width, 0)
            ]
        };
    }
}