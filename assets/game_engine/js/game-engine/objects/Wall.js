import { Hitbox, HitboxType } from "../events/Hitbox.js";
import { Canvas } from "../graphics/Canvas.js";
import { Vector } from "../util/Vector.js";
import { PhysicsObject } from "./PhysicsObject.js";

export class Wall extends PhysicsObject {
	/**
	 * @param {Vector} v1 Starting position
	 * @param {Vector} v2 End position
	 * @param {number} lineWidth Drawn thickness of the wall
	 */
	constructor(v1, v2, color, lineWidth, mass, elasticity) {
		// Pass midpoint of v1 and v2 to super constructor as pos, 
		super(v2.copy().subtract(v1).scale(0.5).add(v1), v2.copy().subtract(v1).dir(), new Hitbox([
			new Vector( v2.copy().subtract(v1).mag() / 2, 0),
			new Vector(-v2.copy().subtract(v1).mag() / 2, 0)
		], HitboxType.POLY), mass, elasticity);

		this.color = color;
		this.lineWidth = lineWidth;
	}

	update(dt) {
		super.update(dt);
	}
	/**
	 * @param {Canvas} canvas
	 */
	draw(canvas) {
		canvas.lineTo(this.verts[0].x, this.verts[0].y, this.verts[1].x, this.verts[1].y, this.color, this.lineWidth);
	}
}