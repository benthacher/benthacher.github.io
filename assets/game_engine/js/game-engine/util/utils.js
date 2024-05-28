import { HitboxType } from "../events/Hitbox.js";
import { GameObject } from "../objects/GameObject.js";
import { PhysicsObject } from "../objects/PhysicsObject.js";
import { Vector } from "./Vector.js";

/**
 * @param {number} a Angle in degrees
 * @returns Angle in radians
 */
export function rad(a) {
    return a * Math.PI / 180;
}
/**
 * @param {number} a Angle in radians
 * @returns Angle in degrees
 */
export function deg(a) {
    return a * 180 / Math.PI;
}
/**
 * @param {number|Vector} min
 * @param {number|Vector} max
 * @returns Random number within range [min, max)
 */
export function rand(min, max) {
    if (min instanceof Vector && max instanceof Vector)
        return new Vector(rand(min.x, max.x), rand(min.y, max.y));
    else
        return Math.random() * (max - min) + min;
}
/**
 * @param {number|Vector} d Distribution
 * @returns Random number between -d and d
 */
export function randDist(d) {
    if (d instanceof Vector)
        return rand(d.copy().scale(-1), d);
    else
        return rand(-d, d);
}
/**
 * @returns Random color string in rgb format
 */
export function randColor() {
    return `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`;
}
/**
 * @param {Vector} vec1 
 * @param {Vector} vec2 
 * @returns Distance between the two vectors
 */
export function dist(vec1, vec2) {
    return Math.hypot(vec1.x - vec2.x, vec1.y - vec2.y);
}
/**
 * @param {number} v0 Starting value
 * @param {number} v1 Ending value
 * @param {number} t Percent between values [0, 1]
 * @returns Interpolated value
 */
export function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
}
/**
 * @param {number} v0 Starting value
 * @param {number} v1 Ending value
 * @param {number} t Percent between values [0, 1]
 * @returns Interpolated value
 */
 export function flooredLerp(v0, v1, t) {
    return Math.floor(v0 * (1 - t) + v1 * t);
}
/**
 * @param {Vector} vec1 
 * @param {Vector} vec2 
 * @returns Direction of difference vector between two vectors
 */
export function getAngle(vec1, vec2) {
    // lineTo(vec1.x, vec2.y, vec2.x, vec2.y, "red", 2, true);
    // lineTo(vec1.x, vec2.y, vec2.x, vec2.y, "blue", 2, true);
    // lineTo(vec1.x, vec2.y, vec2.x, vec2.y, "green", 2, true);
    return Math.atan2(vec1.y - vec2.y, vec1.x - vec2.x);
}
/**
 * @param {number} n Number to round
 * @param {number} d Decimal places
 * @returns Number n round to d decimal places
 */
export function round(n, d) {
    if (!d)
        return Math.round(n);
    return Math.round(n * (10 ** d)) / (10 ** d);
}
/**
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} width1 
 * @param {number} height1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} width2 
 * @param {number} height2 
 * @returns true if positions overlap
 */
export function AABB(x1, y1, width1, height1, x2, y2, width2, height2) {
    return (x1 < x2 + width2  &&
            x1 + width1 > x2  &&
            y1 < y2 + height2 &&
            y1 + height1 > y2)
}
/**
 * @param {GameObject} obj1 Object 1
 * @param {GameObject} obj2 Object 2
 * @returns true if objects are close enough to collide
 */
export function broadCollision(obj1, obj2) {
    return AABB(obj1.pos.x - obj1.hitbox.furthest, obj1.pos.y - obj1.hitbox.furthest,
                obj1.hitbox.furthest * 2, obj1.hitbox.furthest * 2,
                obj2.pos.x - obj2.hitbox.furthest, obj2.pos.y - obj2.hitbox.furthest,
                obj2.hitbox.furthest * 2, obj2.hitbox.furthest * 2);
}
/**
 * @param {PhysicsObject} obj Object (assumed to have a POLY hitbox)
 * @param {Vector} p point
 * @returns Point in obj.hitbox closest to p
 */
export function closestVertexToPoint(obj, p){
    let closest = obj.hitbox.points[0];
    let min = Infinity;
    for(const point of obj.hitbox.points) {
        const distance = dist(point, p);
        if (distance < min) {
            closest = point;
            min = distance;
        }
    }
    return closest.copy();
}
/**
 * @param {PhysicsObject} obj1 Physics object 1
 * @param {PhysicsObject} obj2 Physics object 2
 * @returns Returns array of normalized vectors representing the axes used in the SAT
 */
export function getSATAxes(obj1, obj2) {
    let axes = [];
    let obj1_num_axes = 0;

    // If both objects are circles, we just need the normalized difference vector as an axis
    if (obj1.hitbox.type == HitboxType.CIRCLE && obj2.hitbox.type == HitboxType.CIRCLE) {
        axes.push(obj2.pos.copy().subtract(obj1.pos).normalize());
        obj1_num_axes = 1;
    // If obj1 is a circle, get the closest point of obj2's hitbox and get an axis from it
    // From obj2's normal_angles, make a set of normal vectors and add them to axes
    } else if (obj1.hitbox.type == HitboxType.CIRCLE) {
        axes.push(closestVertexToPoint(obj2, obj1.pos).subtract(obj1.pos).normalize());
        obj1_num_axes = 1;
        for (const normalAngle of obj2.hitbox.normalAngles) {
            const angle = normalAngle + obj2.angle;
            axes.push(new Vector(Math.cos(angle), Math.sin(angle)))
        }
    } else if (obj2.hitbox.type == HitboxType.CIRCLE) {
        for (const normalAngle of obj1.hitbox.normalAngles) {
            const angle = normalAngle + obj1.angle;
            axes.push(new Vector(Math.cos(angle), Math.sin(angle)))
        }
        obj1_num_axes = axes.length - 1;
        axes.push(closestVertexToPoint(obj1, obj2.pos).subtract(obj2.pos).normalize());
    } else { // both objects are polys
        for (const normalAngle of obj1.hitbox.normalAngles) {
            const angle = normalAngle + obj1.angle;
            axes.push(new Vector(Math.cos(angle), Math.sin(angle)))
        }
        obj1_num_axes = axes.length - 1;
        for (const normalAngle of obj2.hitbox.normalAngles) {
            const angle = normalAngle + obj2.angle;
            axes.push(new Vector(Math.cos(angle), Math.sin(angle)))
        }
    }

    return [ axes, obj1_num_axes ];
}
/**
 * @param {Vector} axis Normalized axis vector
 * @param {GameObject} obj Object to project onto vector
 * @returns Min and max projection lengths, collision vertex
 */
function projectGameObject(axis, obj){
    if (obj.hitbox.type == HitboxType.CIRCLE) {
        const r = obj.hitbox.furthest;
        const pos_proj = axis.dot(obj.pos);
        
        return {
            min: pos_proj - r,
            max: pos_proj + r,
            minVert: obj.pos.copy().add(axis.copy().scale(-r))
        };
    }

    let min = axis.dot(obj.verts[0]);
    let max = min;
    let minVert = obj.verts[0];

    for(const vert of obj.verts){
        const p = axis.dot(vert);
        if (p < min) {
            min = p;
            minVert = vert;
        }
        if (p > max)
            max = p;
    }

    return { min, max, minVert };
}
/**
 * Separating Axis Theorem implementation
 * @param {PhysicsObject} obj1 Object 1
 * @param {PhysicsObject} obj2 Object 2
 */
 export function SAT(obj1, obj2) {
    let minOverlap = Infinity;
    let smallestAxis;
    let vertexObj;

    const [ axes, obj1_num_axes ] = getSATAxes(obj1, obj2);
    let proj1 = 0, proj2 = 0;

    for (let i = 0; i < axes.length; i++) {
        const axis = axes[i];

        proj1 = projectGameObject(axis, obj1);
        proj2 = projectGameObject(axis, obj2);

        let overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);

        if (overlap < 0)
            return false;
        
        if ((proj1.max > proj2.max && proj1.min < proj2.min) ||
            (proj1.max < proj2.max && proj1.min > proj2.min)) {

            let mins = Math.abs(proj1.min - proj2.min);
            let maxs = Math.abs(proj1.max - proj2.max);

            if (mins < maxs) {
                overlap += mins;
            } else {
                overlap += maxs;
                axis.scale(-1);
            }
        }
        
        if (overlap < minOverlap) {
            minOverlap = overlap;
            smallestAxis = axis;

            if (i < obj1_num_axes) {
                vertexObj = obj2;
                if (proj1.max > proj2.max)
                    smallestAxis = axis.scale(-1);
            } else {
                vertexObj = obj1;
                if (proj1.max < proj2.max)
                    smallestAxis = axis.scale(-1);
            }
        }  
    }
    
    const contactVertex = projectGameObject(smallestAxis, vertexObj).minVert;

    if (vertexObj === obj2)
        smallestAxis.scale(-1);

    return {
        penitrationDepth: minOverlap,
        axis: smallestAxis,
        vertex: contactVertex
    }
}

/**
 * @class SoundManager
 * @classdesc Sound Manager class
 * @param {Array} sounds
 */
export class SoundManager {
    constructor() {
        this.sounds = [];
    }
    /**
     * Clears any sounds playing
     */
    clearSounds() {
        for (let i in this.sounds) {
            this.sounds[i].pause();
            this.sounds.splice(i, 1);
        }
    }
    /**
     * @param {string} src Path to audio file
     * @param {number} volume Volume [0, 1]
     * @param {boolean} loop Whether or not to loop the sound
     */
    playSound(src, volume, loop = false) {
        let sound = new Audio(src);
        
        sound.loop = loop;
        sound.volume = volume;
        sound.play();
        
        this.sounds.push(sound);
    }
}