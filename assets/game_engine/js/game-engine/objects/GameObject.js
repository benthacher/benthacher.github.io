import { Hitbox } from "../events/Hitbox.js";
import { Vector } from "../util/Vector.js";

/**
 * @class GameObject
 * @classdesc A GameObject object
 * @param {Vector} pos
 * @param {number} angle Angle
 * @param {Hitbox} hitbox
 */

export class GameObject {
	/**
	 * 
	 * @param {Vector} pos Position vector
	 * @param {number} angle Angle
	 * @param {Hitbox} hitbox Hitbox for object
	 */
	constructor(pos, angle, hitbox) {
		this.pos = pos;
		this.angle = angle;
		this.hitbox = hitbox;
		this.verts = hitbox ? this.getAdjustedHitbox() : [];

		this.game = undefined;
		this.remove = false;
	}

	update(dt) {
		this.verts = this.hitbox ? this.getAdjustedHitbox() : [];
	}
	/**
	 * 
	 * @param {Canvas} canvas Canvas used to draw object
	 */
	draw(canvas) { }

	/**
	 * Removes GameObject from Game.objects list
	 */
	destroy() {
		this.remove = true; // flags GameObject for deletion
	}

	getAdjustedHitbox() {
		return this.hitbox.points.map(point => this.pos.copy().add(point.copy().setDir(this.angle + point.dir())));
	}
}