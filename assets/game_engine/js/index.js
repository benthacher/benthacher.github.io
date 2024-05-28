import { CallbackHandler, CallbackMode } from "./game-engine/events/CallbackHandler.js";
import { Game } from "./game-engine/Game.js";
import { Canvas } from "./game-engine/graphics/Canvas.js"
import { GameMap } from "./game-engine/graphics/GameMap.js";
import { Box } from "./game-engine/objects/Box.js";
import { Vector } from "./game-engine/util/Vector.js";
import { Wall } from "./game-engine/objects/Wall.js";
import { ParticleEmitter } from "./game-engine/objects/Particle.js"

const FPS = 60;
let fpsInterval = 1000 / FPS,
    then = Date.now(),
    now,
    elapsed;

const canvas = new Canvas(document.querySelector('canvas'), new GameMap(5, 2.5, 'black'), { globalCompositeOperation: 'xor' });
const cbh = new CallbackHandler(canvas);
var game = new Game(canvas, cbh, FPS);

const resize = () => canvas.resize(canvas.canvas.clientWidth, canvas.canvas.clientHeight);

function init() {
	resize();
	window.onresize = resize;

	const player = new Box(new Vector(1, 1), 0, 1, 1, 1, 0.7, 'blue');

	game.addObjects(player);

	game.objects.forEach(o => o.draggable = true);

	// add walls
	game.addObjects(
		new Wall(new Vector(0, 0), new Vector(canvas.map.width, 0), 'black', 0.01, Infinity, 1),
		new Wall(new Vector(0, 0), new Vector(0, canvas.map.height), 'black', 0.01, Infinity, 1),
		new Wall(new Vector(canvas.map.width, 0), new Vector(canvas.map.width, canvas.map.height), 'black', 0.01, Infinity, 1),
		new Wall(new Vector(0, canvas.map.height), new Vector(canvas.map.width, canvas.map.height), 'black', 0.01, Infinity, 1),
	);

	// cbh.onwheel = cbh.mouse.zoomToPos();
	cbh.onmousedown = function() {
		game.objects.forEach(o => {
			if (o.draggable && o.checkPointCollision(canvas.calcMapCoords(this.mouse.pos))) {
				o.gettingDragged = true;
				o.vel.set(new Vector(0, 0))
			}
		})
	};
	cbh.onmousemove = function() {
		// let dragging = false;
		game.objects.forEach(o => {
			if (o.draggable && o.gettingDragged) {
				this.mouse.dragVector(o.pos);
				// dragging = true;
			}
		});

		// if (!dragging)
		// 	this.mouse.dragVector(canvas.camera.pos, true);
	};
	cbh.onmouseup = function() {
		game.objects.forEach(o => {
			if (o.draggable && o.gettingDragged) {
				o.gettingDragged = false;
				o.vel.set(this.mouse.vel);
			}
		});
	}

	cbh.update = function() {
		game.objects.forEach(o => {
			if (o.draggable && o.gettingDragged) {
				this.mouse.dragVector(o.pos);
				o.vel.set(this.mouse.vel);
			}
		});
	}

	cbh.attachKey('c', CallbackMode.PRESS, () => game.updatePhysics = !game.updatePhysics);

	cbh.attachKey('Enter', CallbackMode.PRESS, () => {
		game.objects.forEach((o, i) => {
			o.update(game.dt_step); // update object

			if (o.remove) // if it's flagged for removal, remove it
				game.objects.splice(i, 1);
		});

		game.resolveCollisions();
	});

	let emitter = new ParticleEmitter(new Vector(2, 1), 30, 10);
	emitter.setDescriptor('/assets/game_engine/js/game-engine/particles/Fire.xml');

	game.addObjects(emitter)

	emitter = new ParticleEmitter(new Vector(2, 1), 40, 1);
	emitter.setDescriptor('/assets/game_engine/js/game-engine/particles/Smoke.xml');

	game.addObjects(emitter)

	cbh.attachKey('ArrowLeft',  CallbackMode.HOLD, () => player.vel.x -= 0.3)
	cbh.attachKey('ArrowRight', CallbackMode.HOLD, () => player.vel.x += 0.3)
	cbh.attachKey('ArrowUp',    CallbackMode.HOLD, () => player.vel.y += 0.5)
	cbh.attachKey('ArrowDown',  CallbackMode.HOLD, () => player.vel.y -= 0.5)

	loop();
}

function loop() {
    if (game.stopped)
		return;

	requestAnimationFrame(loop)

    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

		try {
			game.update();
			canvas.fillTextRaw(100, 100, (1000 / elapsed).toFixed(0), 'Verdana', 10, 'black')
		} catch (e) {
			console.log(e);
			game.stopped = true;
		}
    }
}

init();