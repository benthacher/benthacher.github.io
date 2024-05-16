let mouse = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    down: false
};
let keys = {};
let canvas = document.querySelector('canvas');

canvas.onmousemove = handleMouseMove;
canvas.onmousedown = handleMouseDown;
canvas.onmouseup = handleMouseUp;
window.onkeydown = handleKeyDown;
window.onkeyup = handleKeyUp;

document.querySelector('#speed').oninput = function(e) {
    speed = parseFloat(this.value);
}

function handleMouseMove(e) {
    if (mouse.down) {
        mouse.x = e.offsetX;
        mouse.y = e.offsetY;
    }
}

function handleKeyDown(e) {
    keys[e.key] = true;
}

function handleKeyUp(e) {
    keys[e.key] = false;
}

function handleMouseDown(e) {
    mouse.down = true;
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
}

function handleMouseUp(e) {
    mouse.down = false;
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
}