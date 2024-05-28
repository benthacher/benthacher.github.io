import { Canvas } from "../graphics/Canvas.js";
import { lerp } from "./utils.js";

/**
 * @class Vector
 * @classdesc A 2d Vector object
 * @param {number} x
 * @param {number} y
 */

export class Vector {
    /**
     * Simple 2d Vector class
     * @param {number} x X component
     * @param {number} y Y component
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * 
     * @param {Vector} vec Vector to copy components from
     * @returns this vector for method chaining
     */
    set(vec) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    }
    /**
     * Computes the vector's magnitude
     * @returns The vector's magnitude
     */
    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    /**
     * Computes the vector's direction
     * @returns The vector's direction
     */
    dir() {
        if (this.x == 0)
            return Math.atan2(this.y, 0.00001);
        
        return Math.atan2(this.y, this.x);
    }
    /**
     * Sets the magnitude of vector
     * @param {number} m Desired magnitude
     * @returns this vector for method chaining
     */
    setMag(m) {
        let d = this.dir();

        this.x = m * Math.cos(d);
        this.y = m * Math.sin(d);

        return this;
    }
    /**
     * Sets the direction of vector
     * @param {number} d Desired direction
     * @returns this vector for method chaining
     */
    setDir(d) {
        let m = this.mag();

        this.x = m * Math.cos(d);
        this.y = m * Math.sin(d);

        return this;
    }
    /**
     * Copies vector
     * @returns new vector with identical components
     */
    copy() {
        return new Vector(this.x, this.y);
    }
    /**
     * Normalizes the vector to magnitude 1
     * @returns this vector for method chaining
     */
    normalize() {
        if (this.mag() == 0)
            return new Vector(1, 0);
        return this.scale(1 / this.mag());
    }
    /**
     * @returns Vector Perpendicular to this vector
     */
    perp() {
        return new Vector(-this.y, this.x);
    }
    /**
     * Adds two vectors
     * @param {Vector} other Addend vector
     * @returns this vector for method chaining
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    /**
     * Subtracts other vector from this vector
     * @param {Vector} other Subtrahend vector
     * @returns this vector for method chaining
     */
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    /**
     * Scales vector by factor
     * @param {number} factor Scale factor
     * @returns this vector for method chaining
     */
    scale(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }
    /**
     * Multiplies this vector's components by another vector's components
     * @param {Vector} other Vector whose components are used to multiply this vector
     * @returns this vector for method chaining
     */
    multiply(other) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }
    /**
     * Computes the dot product of two vectors
     * @param {Vector} other Other vector
     * @returns Dot product
     */
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    /**
     * Computes the two dimensional cross product (z components = 1)
     * @param {Vector} other Other vector
     * @returns Cross product
     */
    cross(other){
        return this.x * other.y - this.y * other.x;
    }
    /**
     * Computes Linear interpolation between vectors
     * @param {Vector} final Final vector
     * @param {number} t Percent between values [0, 1]
     * @returns interpolated vector
     */
    lerp(final, t) {
        return new Vector(lerp(this.x, final.x, t), lerp(this.y, final.y, t));
    }
    /**
     * 
     * @returns Formatted Vector string
     */
    toString() {
        return `[${this.x.toFixed(3)}, ${this.y.toFixed(3)}]`;
    }
    /**
     * @param {Canvas} canvas 
     * @param {Vector} basePos 
     * @param {string} color
     * @param {number} thickness
     */
    draw(canvas, basePos, color, thickness=0.01, label='') {
        canvas.lineTo(basePos.x, basePos.y, basePos.x + this.x, basePos.y + this.y, color, thickness);
        if (label)
            canvas.fillText(basePos.x + this.x, basePos.y + this.y, label, 'Verdana', 14, 'black');
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
}