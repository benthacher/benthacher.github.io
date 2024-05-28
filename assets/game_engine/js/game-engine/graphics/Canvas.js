import { Camera } from "./Camera.js";
import { GameMap } from "./GameMap.js";
import { Vector } from "../util/Vector.js";

/**
 * @class Canvas
 * @classdesc Canvas object
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Camera} camera
 * @param {GameMap} map
 */
export class Canvas {
	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {GameMap} map
	 */
	constructor(canvas, map, options) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.ctx.globalCompositeOperation = 'difference';
		this.map = map;
		this.camera = new Camera(this.map.width / 2, this.map.height / 2, 100);
	}
	/**
	 * @param {number} width
	 * @param {number} height
	 */
	resize(width, height) {
		this.canvas.width  = width;
		this.canvas.height = height;
	}
	/**
	 * Calculate the screen coordinates of a vector in the game world !
	 * @param {number} v Vector or x value
	 * @param {number} y (optional) y value
	 * @returns transformed screen vector
	 */
	calcScreenCoords(v, y) {
		// if there's only v (vector) then use components
		// else use v as an x value then y as y value

		let x = v.x ?? v;
			y = v.y ?? y;

		return new Vector(
			(((x - this.camera.pos.x) * this.camera.zoom)  + this.canvas.width  / 2),
			(((y - this.camera.pos.y) * -this.camera.zoom) + this.canvas.height / 2)
		);
	}
	/**
	 * Calculate the game world coordinates of a vector on the screen !
	 * @param {number} v Vector or x value
	 * @param {number} y (optional) y value
	 * @returns transformed map vector
	 */
	calcMapCoords(v, y) {
		let x = v.x ?? v;
			y = v.y ?? y;

        return new Vector(
            ((x - this.canvas.width  / 2) / this.camera.zoom) + this.camera.pos.x,
            ((y + this.canvas.height / 2) / this.camera.zoom) + this.camera.pos.y
        );
    }

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.rect(0, 0, this.map.width, this.map.height, this.map.color);
	}

	rectRaw(x, y, width, height, color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height))
	}

	circleRaw(x, y, r, color) {
		if (r < 0)
			return;

		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = color;
		this.ctx.fill();
	}
	/**
	 * Fill n-gon defined by points array with color
	 * @param {Vector[]} points Array of Vectors defining path
	 * @param {string} color Color string
	 */
	fillPolyRaw(points, color) {
		this.ctx.beginPath();
		this.ctx.moveTo(points[0].x, -points[0].y);

		for (let i = 1; i < points.length; i++)
			this.ctx.lineTo(points[i].x, -points[i].y)

		this.ctx.fillStyle = color;
		this.ctx.fill();
	}

	drawImageRaw(x, y, width, height, sprite, angle=0) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(angle);
		ctx.drawImage(sprite, width / 2, height / 2, width, height);
		ctx.restore();
	}

	fillTextRaw(x, y, text, font, size, color) {
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillStyle = color;
		this.ctx.font = `${size}px ${font}`;
		this.ctx.fillText(text, x, y);
	}

	rect(x, y, width, height, color) {
		let p = this.calcScreenCoords(x, y);

		this.rectRaw(p.x, p.y, width * this.camera.zoom, -height * this.camera.zoom, color);
	}

	circle(x, y, r, color) {
		let p = this.calcScreenCoords(x, y);

		this.circleRaw(p.x, p.y, r * this.camera.zoom, color);
	}

	fillPoly(points, color) {
		const start = this.calcScreenCoords(points[0])

		this.ctx.beginPath();
		this.ctx.moveTo(start.x, start.y);

		for (let i = 1; i < points.length; i++) {
			let p = this.calcScreenCoords(points[i]);

			this.ctx.lineTo(p.x, p.y);
		}

		this.ctx.fillStyle = color;
		this.ctx.fill();
	}

	drawImage(x, y, width, height, sprite, angle=0) {
		let p = this.calcScreenCoords(x, y);

		this.drawImageRaw(p.x, p.y, width * this.camera.zoom, -height * camera.zoom, sprite, angle);
	}

	fillText(x, y, text, font, size, color) {
		let p = this.calcScreenCoords(x, y);

		this.fillTextRaw(p.x, p.y, text, font, size * this.camera.zoom, color);
	}

	lineToRaw(x1, y1, x2, y2, color, thickness=1) {
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = thickness;
		this.ctx.stroke();
	}

	lineTo(x1, y1, x2, y2, color, thickness=1) {
		let p1 = this.calcScreenCoords(x1, y1);
		let p2 = this.calcScreenCoords(x2, y2);

		this.lineToRaw(p1.x, p1.y, p2.x, p2.y, color, thickness * this.camera.zoom);
	}
}