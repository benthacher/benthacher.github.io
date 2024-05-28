import { Hitbox } from "../events/Hitbox.js";
import { Canvas } from "../graphics/Canvas.js";
import { PhysicsObject } from "../objects/PhysicsObject.js"
import { Vector } from "../util/Vector.js";

/**
 * @class Box
 * @classdesc Box class
 * @param {string} color Color of box
 */
export class Box extends PhysicsObject {
	/**
	 * 
	 * @param {Vector} pos Position vector
	 * @param {number} angle Angle
	 * @param {number} width Width of box
	 * @param {number} height Height box
	 * @param {number} mass Mass of box
	 * @param {string} color Color of box
	 */
	constructor(pos, angle, width, height, mass, elasticity, color) {
		super(pos, angle, new Hitbox([
			new Vector( width / 2,  height / 2),
			new Vector( -width / 2, height / 2),
			new Vector(-width / 2, -height / 2),
			new Vector(width / 2,  -height / 2),
		]), mass, elasticity);

		this.color = color;
	}

	update(dt) {
		super.update(dt);
	}

	/**
	 * 
	 * @param {Canvas} canvas Canvas used to draw object
	 */
	draw(canvas) {
		canvas.fillPoly(this.verts, this.color);

	// 	for (let i = 0; i < this.hitbox.normalAngles.length; i++) {
	// 		const angle = this.hitbox.normalAngles[i];
	// 		const normal = new Vector(Math.cos(angle + this.angle), Math.sin(angle + this.angle));
			
	// 		const p1 = this.verts[i].copy();
	// 		const p2 = this.verts[(i + 1) % this.verts.length].copy();

	// 		const basePos = p2.subtract(p1).scale(0.5).add(p1);

	// 		normal.draw(canvas, basePos);
	// 	}
	}
}