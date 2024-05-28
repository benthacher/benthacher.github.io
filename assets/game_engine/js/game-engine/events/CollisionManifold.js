import { PhysicsObject } from "../objects/PhysicsObject.js";
import { Vector } from "../util/Vector.js";

/**
 * @class CollisionManifold
 * @classdesc Class describing collision between two objects
 */
export class CollisionManifold {
	/**
	 * @param {PhysicsObject} obj1 Object 1
	 * @param {PhysicsObject} obj2 Object 2
	 * @param {Vector} normal Collision normal
	 * @param {number} penitrationDepth Penetration depth of collision
	 * @param {Vector} contact Contact of point of collision
	 */
	constructor(obj1, obj2, normal, penitrationDepth, contact) {
		this.obj1 = obj1;
		this.obj2 = obj2;
		this.normal = normal;
		this.penitrationDepth = penitrationDepth;
		this.contact = contact;
	}

    resolveCollision() {
        const penResolution = this.normal.copy().scale(this.penitrationDepth / (this.obj1.inv_mass + this.obj2.inv_mass));
        this.obj1.pos.add(penResolution.copy().scale(this.obj1.inv_mass));
        this.obj2.pos.add(penResolution.scale(-this.obj2.inv_mass));

        //1. Closing velocity
        const collArm1 = this.contact.copy().subtract(this.obj1.pos);
        const rotVel1  = collArm1.copy().perp().scale(this.obj1.angVel);
        const closVel1 = this.obj1.vel.copy().add(rotVel1);
        const collArm2 = this.contact.copy().subtract(this.obj2.pos);
        const rotVel2  = collArm2.copy().perp().scale(this.obj2.angVel);
        const closVel2 = this.obj2.vel.copy().add(rotVel2);

        //2. Impulse augmentation
        const impAug1 = this.obj1.inv_inertia * collArm1.cross(this.normal) ** 2;
        const impAug2 = this.obj2.inv_inertia * collArm2.cross(this.normal) ** 2;

        const relativeVel = closVel1.subtract(closVel2);
        const separationVel = relativeVel.dot(this.normal);
        const newSeparationVel = -separationVel * Math.min(this.obj1.elasticity, this.obj2.elasticity);
        const vsep_diff = newSeparationVel - separationVel;

        const impulse = vsep_diff / (this.obj1.inv_mass + this.obj2.inv_mass + impAug1 + impAug2);
        const impulseVec = this.normal.copy().scale(impulse);

        //3. Changing the velocities
        this.obj1.vel.add(impulseVec.copy().scale(this.obj1.inv_mass));
        this.obj2.vel.add(impulseVec.copy().scale(-this.obj2.inv_mass));

        this.obj1.angVel += this.obj1.inv_inertia * collArm1.cross(impulseVec);
        this.obj2.angVel -= this.obj2.inv_inertia * collArm2.cross(impulseVec); 
    }
}