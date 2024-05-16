let ctx = canvas.getContext('2d');

window.onresize = resize;

function clear(c) {
    if (c)
        rect(0, 0, canvas.width, canvas.height, c);
    else
        ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function rect(x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
}

function circle(x, y, r, c) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = c;
    ctx.fill();
}

function arc(x, y, r, a0, af, c, t) {
    ctx.beginPath();
    ctx.arc(x, y, r, a0, af, false);
    ctx.strokeStyle = c;
    ctx.lineWidth = t;
    ctx.stroke();
}

function line(x1, y1, x2, y2, c, t) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = c;
    ctx.lineWidth = t;
    ctx.stroke();
}

function text(x, y, text) {
    ctx.font = '20px Verdana';
    ctx.fillText(text, x, y);
}

function resize() {
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = 300;
}