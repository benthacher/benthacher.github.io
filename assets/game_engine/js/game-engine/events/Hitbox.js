import { Vector } from "../util/Vector.js"

/**
 * HitboxType
 * @readonly
 * @enum {number}
 */
export const HitboxType = Object.freeze({
    POLY: 0,
    CIRCLE: 1
});

/**
 * @class Hitbox
 * @classdesc Hitbox class
 * @param {Vector[]} points
 * @param {HitboxType} type
 */
export class Hitbox {
    /**
     * @param {Vector[]} points Array of vectors making up the hitbox, relative to the center of mass (COM)
     * @param {HitboxType} type Type of hitbox, defaults to POLY
     */
    constructor(points, type=HitboxType.POLY) {
        this.points = points.slice(0); // copy points array
        this.type = type;
        this.normalAngles = [];

        if (this.type == HitboxType.POLY) {
            for (let i = 0; i < this.points.length; i++) {
                const p1 = this.points[i].copy();
                const p2 = this.points[(i + 1) % this.points.length].copy();

                this.normalAngles.push(p2.subtract(p1).dir() - Math.PI / 2);
            }
        }

        // Get point with highest magnitude
        this.furthest = this.getFurthest();
    }

    getFurthest() {
        return this.points.reduce((largest, point) => Math.max(point.mag(), largest), 0);
    }

    /**
     * Scales hitbox by scalar, recalculates furthest point
     * @param {number} scalar Scalar
     */
    scale(scalar) {
        this.furthest = 0;

        for (const point of this.points) {
            point.scale(scalar);

            if (point.mag() > this.furthest)
                this.furthest = point.mag();
        }

        return this;
    }

    area() {
        switch (this.type) {
            case HitboxType.POLY:
                let area = 0;

                for (let i = 0; i < this.points.length; i++) {
                    let p1 = this.points[i].copy();
                    let p2 = this.points[(i + 1) % this.points.length].copy();
        
                    area += p2.mag() * p1.mag() * Math.sin(p2.dir() - p1.dir()) / 2;
                }
                return area;
            case HitboxType.CIRCLE:
                return Math.PI * this.points[0].x ** 2;
            }
    }
}