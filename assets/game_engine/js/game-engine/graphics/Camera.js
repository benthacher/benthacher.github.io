import { Vector } from "../util/Vector.js";

/**
 * @class Camera
 * @classdesc Camera class
 * @param {Vector} pos
 * @param {number} zoom
 */
export class Camera {
    constructor(x, y, zoom = 1) {
        this.pos = new Vector(x, y);
        this.zoom = zoom;
    }

    /**
     * Move camera to position and zoom
     * @param {Vector} vec Position to move to
     * @param {number} zoom Desired zoom
     */
    move(vec, zoom) {
        this.pos.set(vec);
        if (zoom)
            this.zoom = zoom;
    }

    update(mapWidth, mapHeight) {
        if (this.zoom < 0)
            this.zoom = 0;

        this.leftBound = (layerWidth/2) / this.zoom;
        this.rightBound = (mapWidth) - (layerWidth/2) / this.zoom;
        this.topBound = (layerHeight/2) / this.zoom;
        this.bottomBound = (mapHeight) - (layerHeight/2) / this.zoom;

        if (this.pos.x < this.leftBound)
            this.pos.x = this.leftBound;
        if (this.pos.x > this.rightBound)
            this.pos.x = this.rightBound;
        if (this.pos.y < this.topBound)
            this.pos.y = this.topBound;
        if (this.pos.y > this.bottomBound)
            this.pos.y = this.bottomBound;

        if (mapWidth * this.zoom < layerWidth && mapHeight * this.zoom < layerHeight) {
            this.pos.x = mapWidth / 2;
            this.pos.y = mapHeight / 2;
        }
    }
}