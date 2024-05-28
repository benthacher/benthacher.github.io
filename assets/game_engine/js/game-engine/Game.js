import { CallbackHandler } from "./events/CallbackHandler.js";
import { CollisionManifold } from "./events/CollisionManifold.js";
import { Canvas } from "./graphics/Canvas.js";
import { GameObject } from "./objects/GameObject.js";
import { PhysicsObject } from "./objects/PhysicsObject.js";
import { AABB, broadCollision, dist, SAT } from "./util/utils.js";
import { Vector } from "./util/Vector.js";

/**
 * @class Game
 * @classdesc Game class
 * @param {Canvas} canvas
 * @param {CallbackHandler} callbackHandler
 * @param {GameObject[]} objects
 */
export class Game {
	/**
	 *
	 * @param {Canvas} canvas Canvas object for drawing
	 * @param {CallbackHandler} callbackHandler CallbackHandler object for callbacks
	 * @param {number} fps Frames per second
	 */
	constructor(canvas, callbackHandler, fps) {
		this.canvas = canvas;
		this.callbackHandler = callbackHandler;
		this.fps = fps;
		this.dt = 1 / fps;
		this.nSteps = 2;
		this.dt_step = this.dt / this.nSteps;
		this.stopped = false;

		/** @type {GameObject[]} */
		this.objects = [];
		/** @type {CollisionManifold[]} */
		this.collisions = [];
		this.maxCollisions = 1000;

		this.updatePhysics = true;
		this.maxObjects = 200;
	}

	update() {
		this.canvas.clear();

		this.callbackHandler.handleCallbacks(this.dt);

		for (let i = this.nSteps; i--;) {

			if (this.updatePhysics) {
				this.objects.forEach((o, i) => {
					o.update(this.dt_step); // update object

					if (o.remove) // if it's flagged for removal, remove it
						this.objects.splice(i, 1);
				});

				this.resolveCollisions();
			}

		}

		this.objects.forEach(o => o.draw(this.canvas)); // draw everything
	}
	/**
	 * @param {GameObject[]} objs GameObject to add
	 */
	addObjects(...objs) {
		for (const obj of objs) {
			if (!obj instanceof GameObject)
				throw `${obj} is not a GameObject.`;

			if (this.objects.length - 1 > this.maxObjects)
				break;

			obj.game = this;
			this.objects.push(obj);
		}
	}

	resolveCollisions() {
		this.collisions.length = 0; // clear any previous collisions

		this.objects.forEach((obj1, i1) => {
			if (!obj1 instanceof PhysicsObject || !obj1.doCollisions)
				return;

			for (let i2 = i1 + 1; i2 < this.objects.length; i2++) {
				const obj2 = this.objects[i2];

				if (!obj2 instanceof PhysicsObject || !obj2.doCollisions)
					continue;

				if ((!obj1.collideWithSimilar && obj1.constructor === obj2.constructor) ||
					 !obj2.collideWithSimilar && obj1.constructor === obj2.constructor)
					continue; // if either object doesn't collide with similar objects, skip

				if (!broadCollision(obj1, obj2)) // skip SAT if objects aren't close enough
					continue;

				const res = SAT(obj1, obj2);

				if (res && this.collisions.length < this.maxCollisions)
					this.collisions.push(new CollisionManifold(obj1, obj2, res.axis, res.penitrationDepth, res.vertex));
			}
		});

		this.collisions.forEach(c => {
			c.resolveCollision();
		});
	}
}