import { Hitbox, HitboxType } from "../events/Hitbox.js";
import { Canvas } from "../graphics/Canvas.js";
import { lerp, rand, randDist } from "../util/utils.js";
import { Vector } from "../util/Vector.js";
import { GameObject } from "./GameObject.js";
import { PhysicsObject } from "./PhysicsObject.js";

export class Particle extends PhysicsObject {
	/**
	 * @param {Vector} pos Position
	 * @param {Vector} vel Velocity
	 * @param {Vector} acc Acceleration
	 * @param {number} angle Angle
	 * @param {number} angVel Angular velocity
	 * @param {number} angAcc Angular Acceleration
	 * @param {number} mass Mass
	 * @param {number} elasticity Coefficient of Restitution
	 * @param {number|number[]} r Red component
	 * @param {number|number[]} g Green component
	 * @param {number|number[]} b Blue component
	 * @param {number|number[]} a Alpha
	 * @param {number} lifetime Lifetime of particle
	 * @param {Hitbox} hitbox Hitbox for particle
	 * @param {number} hitboxSize Initial Scale factor for particle hitbox
	 * @param {number} hitboxScale Scale factor for particle hitbox
	 */
    constructor(name, pos, vel, acc, angle, angVel, angAcc, mass, elasticity, r, g, b, a, lifetime, hitbox, hitboxSize, hitboxScale) {
        super(pos, angle, hitbox.scale(hitboxSize), mass, elasticity);
		this.collideWithSimilar = false;

        this.vel = vel;
        this.acc = acc;

		this.angVel = angVel;
		this.angAcc = angAcc;
        
		this.r_points = typeof r == 'number' ? [ r, r ] : r;
		this.g_points = typeof g == 'number' ? [ g, g ] : g;
		this.b_points = typeof b == 'number' ? [ b, b ] : b;
		this.a_points = typeof a == 'number' ? [ a, a ] : a;

		this.hitboxSize = hitboxSize;
		this.hitboxScale = hitboxScale;

        this.dLife = 1.0 / lifetime;
        this.timeAlive = 0;

		this.doCollisions = true;
		this.collideWithSimilar = false;

		this.name = name;
    }

    update(dt) {
        this.timeAlive += this.dLife * dt;

        if (this.timeAlive >= 1)
            this.destroy();

		this.r = lerp(
			this.r_points[Math.floor((this.r_points.length - 1) * this.timeAlive)],
			this.r_points[ Math.ceil((this.r_points.length - 1) * this.timeAlive)],
			(this.r_points.length - 1) * (this.timeAlive % (1 / (this.r_points.length - 1))));
		this.g = lerp(
			this.g_points[Math.floor((this.g_points.length - 1) * this.timeAlive)],
			this.g_points[ Math.ceil((this.g_points.length - 1) * this.timeAlive)],
			(this.g_points.length - 1) * (this.timeAlive % (1 / (this.g_points.length - 1))));
		this.b = lerp(
			this.b_points[Math.floor((this.b_points.length - 1) * this.timeAlive)],
			this.b_points[ Math.ceil((this.b_points.length - 1) * this.timeAlive)],
			(this.b_points.length - 1) * (this.timeAlive % (1 / (this.b_points.length - 1))));
		this.a = lerp(
			this.a_points[Math.floor((this.a_points.length - 1) * this.timeAlive)],
			this.a_points[ Math.ceil((this.a_points.length - 1) * this.timeAlive)],
			(this.a_points.length - 1) * (this.timeAlive % (1 / (this.a_points.length - 1))));

		this.updateColor();

		this.hitbox.scale(this.hitboxScale);
        super.update(dt); // set verteces
    }

    updateColor() {
        this.color = `rgba(${Math.floor(this.r * 255)}, ${Math.floor(this.g * 255)}, ${Math.floor(this.b * 255)}, ${this.a})`;
    }
}

/**
 * @class ParticleEmitter
 * @classdesc Object that outputs particles
 */
export class ParticleEmitter extends GameObject {
	/**
	 * @param {Vector} pos Position of emitter
	 * @param {number} outputSpeed Particles per second
	 * @param {number} num Number of particles per emit
	 */
	constructor(pos, outputSpeed, num) {
		super(pos, 0, null);
		this.outputSpeed = outputSpeed;
		this.lastOutput = 0;
		this.num = num;
	}
	/**
	 * @param {string} path File path to descriptor on server
	 */
	async setDescriptor(path) {
		this.path = path;
		this.descriptor = await ParticleDescriptor.from(path);
	}

	update(dt) {
		super.update(dt);

		const d = this.descriptor;

		if (!d)
			return; // if no descriptor, no particles can be created

		if (this.lastOutput + (1000 / this.outputSpeed) < Date.now()) {
			for (let i = this.num; i--;) {
				this.game.addObjects(new Particle(
					d.name,
					this.pos.copy().add(randDist(d.pos_dist)),
					d.vel.copy().add(randDist(d.vel_dist)),
					d.acc.copy().add(randDist(d.acc_dist)),
					d.angle + randDist(d.angle_dist),
					d.angVel + randDist(d.angVel_dist),
					d.angAcc + randDist(d.angAcc_dist),
					d.mass + randDist(d.mass_dist),
					d.elasticity + randDist(d.elasticity_dist),
					typeof d.r == 'number' ? d.r + randDist(d.r_dist) : d.r.map((r, i) => r + randDist(d.r_dist[i])),
					typeof d.g == 'number' ? d.g + randDist(d.g_dist) : d.g.map((g, i) => g + randDist(d.g_dist[i])),
					typeof d.b == 'number' ? d.b + randDist(d.b_dist) : d.b.map((b, i) => b + randDist(d.b_dist[i])),
					typeof d.a == 'number' ? d.a + randDist(d.a_dist) : d.a.map((a, i) => a + randDist(d.a_dist[i])),
					d.lifetime + randDist(d.lifetime_dist),
					new Hitbox(d.hitbox.points.map((p, i) => p.copy().add(randDist(d.hitbox_dist[i]))), d.hitbox.type),
					d.hitboxSize + randDist(d.hitboxSize_dist),
					d.hitboxScale + randDist(d.hitboxScale_dist)
				));
			}

			this.lastOutput = Date.now();
		}
	}

	draw(canvas) { }
}

export class ParticleDescriptor {
	constructor(
		name,
		pos_dist,
		vel, vel_dist,
		acc, acc_dist,
		angle, angle_dist,
		angVel, angVel_dist,
		angAcc, angAcc_dist,
		mass, mass_dist,
		elasticity, elasticity_dist,
		r, r_dist,
		g, g_dist,
		b, b_dist,
		a, a_dist,
		lifetime, lifetime_dist,
		hitbox, hitbox_dist,
		hitboxSize, hitboxSize_dist,
		hitboxScale, hitboxScale_dist) {
			this.name = name;
			this.pos_dist = pos_dist;
			this.vel = vel; this.vel_dist = vel_dist;
			this.acc = acc; this.acc_dist = acc_dist;
			this.angle = angle; this.angle_dist = angle_dist;
			this.angVel = angVel; this.angVel_dist = angVel_dist;
			this.angAcc = angAcc; this.angAcc_dist = angAcc_dist;
			this.mass = mass; this.mass_dist = mass_dist;
			this.elasticity = elasticity; this.elasticity_dist = elasticity_dist;
			this.r = r; this.r_dist = r_dist;
			this.g = g; this.g_dist = g_dist;
			this.b = b; this.b_dist = b_dist;
			this.a = a; this.a_dist = a_dist;
			this.lifetime = lifetime; this.lifetime_dist = lifetime_dist;
			this.hitbox = hitbox; this.hitbox_dist = hitbox_dist;
			this.hitboxSize = hitboxSize; this.hitboxSize_dist = hitboxSize_dist;
			this.hitboxScale = hitboxScale; this.hitboxScale_dist = hitboxScale_dist;
		}
	/**
	 * Export particle descriptor to 
	 * @param {string} name Name of particle descriptor
	 */
	export(name) {

	}
	/**
	 * @param {string} path Path to descriptor file on server
	 * @returns ParticleDescriptor
	 */
	static async from(path) {
		const response = await fetch(path);
		const xmlText = await response.text();
		
		const parser = new DOMParser();
		const xml = parser.parseFromString(xmlText, "text/xml");

		if (xml.documentElement.tagName == 'parsererror') {
			console.error('Could not read ParticleDescriptor file.')
			return null;
		}

		if (xml.documentElement.nodeName != 'descriptor') {
			console.error('Root node must be <descriptor>')
			return null;
		}

		const root = xml.documentElement;
		let desc = new ParticleDescriptor();

		for (const child of root.children) {
			if (child.nodeName != 'property') {
				console.error('Child nodes must be <property> nodes');
				return null;
			}

			const type = child.attributes['type'].value;
			const key = child.attributes['key'].value;
			const value = child.innerHTML;
			
			switch (type) {
				case 'string':
					desc[key] = value;
					break;
				case 'float':
					desc[key] = parseFloat(value);
					break;
				case 'Vector':
					const components = value.split(',').map(c => parseFloat(c));
					desc[key] = new Vector(components[0], components[1]);
					break;
				case 'FloatArray':
					desc[key] = value.split(',').map(e => parseFloat(e));
					break;
				case 'Hitbox':
					const pointsElem = child.getElementsByTagName('points')[0];
					let points = pointsElem.innerHTML.split('\n') // split every newline
						.map(s => s.split(',') // split every comma
							.map(c => parseFloat(c))) // parse comma separated value
						.map(a => new Vector(a[0], a[1])) // construct vector from array
						.filter(v => !isNaN(v.x) && !isNaN(v.y)); // filter out invalid vectors

					const type = child.getElementsByTagName('type')[0].innerHTML;
					
					desc[key] = new Hitbox(points, HitboxType[type]);
					break;
				case 'VectorArray':
					desc[key] = value.split('\n')
						.map(s => s.split(',') // split every comma
							.map(c => parseFloat(c))) // parse comma separated value
						.map(a => new Vector(a[0], a[1])) // construct vector from array
						.filter(v => !isNaN(v.x) && !isNaN(v.y)); // filter out invalid vectors
					break;

				default:
					console.error('Unknown property type:', type);
					return null;
			}
		}

		console.log(desc.hitboxSize, desc.hitboxSize_dist)

		return desc;
	}
}