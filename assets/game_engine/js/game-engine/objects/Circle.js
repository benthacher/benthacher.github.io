import { Hitbox, HitboxType } from "../events/Hitbox.js";
import { Canvas } from "../graphics/Canvas.js";
import { PhysicsObject } from "../objects/PhysicsObject.js"
import { lerp } from "../util/utils.js";
import { Vector } from "../util/Vector.js";

/**
 * @class Circle
 * @classdesc Circle class
 * @param {string} color Color of circle
 */
export class Circle extends PhysicsObject {
	constructor(pos, angle, radius, mass, elasticity, color) {
		super(pos, angle, new Hitbox([new Vector(radius, 0)], HitboxType.CIRCLE), mass, elasticity);

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
		canvas.circle(this.pos.x, this.pos.y, this.hitbox.furthest, this.color);
		canvas.lineTo(this.pos.x, this.pos.y, this.pos.x + this.hitbox.furthest * Math.cos(this.angle), this.pos.y + this.hitbox.furthest * Math.sin(this.angle), 'black', 0.01)
	}
}