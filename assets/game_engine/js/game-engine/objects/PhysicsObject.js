import { HitboxType } from "../events/Hitbox.js";
import { dist } from "../util/utils.js";
import { Vector } from "../util/Vector.js";
import { GameObject } from "./GameObject.js";

/**
 * @class PhysicsObject
 * @classdesc A Physics Object
 * @param {Vector} vel Velocity vector
 * @param {Vector} acc Acceleration vector
 * @param {number} angVel Angular velocity
 * @param {number} angAcc Angular acceleration
 * @param {number} mass Mass of object
 */

export class PhysicsObject extends GameObject {
	/**
	 * @param {Vector} pos Position vector
	 * @param {number} angle Angle
	 * @param {Hitbox} hitbox Hitbox for object
	 * @param {number} mass Mass of object
	 * @param {number} elasticity Elasticity
	 */
	constructor(pos, angle, hitbox, mass, elasticity) {
		super(pos, angle, hitbox);
		
		this.vel = new Vector(0, 0);
		this.acc = new Vector(0, 0);

		if (mass < Infinity)
			this.acc = new Vector(0, -9.8);

		this.angVel = 0;
		this.angAcc = 0;

		this.mass = mass;
		this.inv_mass = mass > 0 ? (1 / mass) : 0;

		this.inertia = this.getInertia();
		this.inv_inertia = this.inertia > 0 ? (1 / this.inertia) : 0;

		this.elasticity = elasticity;

		this.doCollisions = true;
		this.collideWithSimilar = true;
	}

	update(dt) {
		this.vel.add(this.acc.copy().scale(dt));
		this.pos.add(this.vel.copy().scale(dt));

		this.angVel += this.angAcc * dt;
		this.angle += this.angVel * dt;
		
		super.update(dt);
	}
	/**
	 * @param {Canvas} canvas 
	 */
	draw(canvas) {
		switch (this.hitbox.type) {
			case HitboxType.POLY:
				canvas.fillPoly(this.verts, this.color);
				break;
			case HitboxType.CIRCLE:
				canvas.circle(this.pos.x, this.pos.y, this.hitbox.furthest, this.color);
				break;
		}
	}

	getInertia() {
		let inertia = 0;

		switch (this.hitbox.type) {
			case HitboxType.POLY:
				for (let i = 0; i < this.hitbox.points.length; i++) {
					let p1 = this.hitbox.points[i].copy();
					let p2 = this.hitbox.points[(i + 1) % this.hitbox.points.length].copy();
					
					const p1_dir = p1.dir();
					p1.setDir(0);
					p2.setDir(p2.dir() - p1_dir);

					const b = p1.x;
					const h = p2.y;
					const a = p2.x;

					inertia += (b * (h ** 3)) / 12 + ((b ** 3) * h + (b ** 2) * h * a + b * h * (a ** 2)) / 12
				}
				break;
			case HitboxType.CIRCLE:
				inertia = (Math.PI / 2) * this.hitbox.points[0].x ** 4;
				break;
		}

		return inertia * this.mass / this.hitbox.area();
	}

	checkPointCollision(vec) {
		if (this.hitbox.type == HitboxType.POLY) {

			for (let i = 0; i < this.hitbox.points.length; i++) {
				const p3 = vec.copy().subtract(this.pos);
	
				if (p3.mag() > this.hitbox.furthest)
					continue;
	
				let p1 = this.hitbox.points[i].copy();
				let p2 = this.hitbox.points[(i + 1) % this.hitbox.points.length].copy();
	
				p1.setDir(p1.dir() + this.angle);
				p2.setDir(p2.dir() + this.angle);
	
				// if p3's direction not is between p1 and p2's direction, skip
				const p3_dot_p2 = p3.dot(p2);
				const p3_dot_p1 = p3.dot(p1);
	
				if (!(p3_dot_p2 > 0 && p3_dot_p1 > 0) && p3_dot_p1 != 0 && p3_dot_p2 != 0)
					continue;
	
				p1.x = p1.x || 0.000001;
				p2.x = p2.x || 0.000001;
				p3.x = p3.x || 0.000001;
				p1.y = p1.y || 0.000001;
				p2.y = p2.y || 0.000001;
				p3.y = p3.y || 0.000001;
			
				// solve it parametrically so there's no weird infinite slope garbage
				const t2 = (p1.x / p3.x - p1.y / p3.y) / ((p2.y - p1.y) / p3.y - (p2.x - p1.x) / p3.x);
			
				const intersection = p2.subtract(p1).scale(t2).add(p1);
	
				if (p3.mag() < intersection.mag())
					return p2.copy().subtract(p1).normalize().perp(); // return the normal vector to the edge that the point collides with
			}
			return false;
		} else if (this.hitbox.type == HitboxType.CIRCLE) {
			return dist(this.pos, vec) < this.hitbox.furthest;
		}
	} 
}