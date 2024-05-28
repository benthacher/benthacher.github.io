let canvas;
let ctx;

let minimap;
let m_ctx;

let backImg;

let zoom = 1;

let map = {};

let cutsceneLine;

function mapResize(width, height) {
    map.width = width;
    map.height = height;
    
    map.bounds = {
        top: [
            new Vector(width, 0),
            new Vector(width, 0),
            new Vector(0, 0),
            new Vector(0, 0)
        ],
        bottom: [
            new Vector(width, height),
            new Vector(width, height),
            new Vector(0, height),
            new Vector(0, height)
        ],
        left: [
            new Vector(0, 0),
            new Vector(0, height),
            new Vector(0, height),
            new Vector(0, 0)
        ],
        right: [
            new Vector(width, 0),
            new Vector(width, height),
            new Vector(width, height),
            new Vector(width, 0)
        ]
    };
}

let camera = {
    pos: new Vector(),
    vel: new Vector(),
    following: null,
    fric: 0.1,
    update: function() {
        if (this.following)
            this.pos = this.following.pos.clone();
        
        this.leftBound = (canvas.width/2) / zoom;
        this.rightBound = (map.width) - (canvas.width/2) / zoom;
        this.topBound = (canvas.height/2) / zoom;
        this.bottomBound = (map.height) - (canvas.height/2) / zoom;
        
        if (this.pos.x < this.leftBound)
            this.pos.x = this.leftBound;
        if (this.pos.x > this.rightBound)
            this.pos.x = this.rightBound;
        if (this.pos.y < this.topBound)
            this.pos.y = this.topBound;
        if (this.pos.y > this.bottomBound)
            this.pos.y = this.bottomBound;

        if (map.width * zoom < canvas.width && map.height * zoom < canvas.height) {
            this.pos.x = map.width / 2;
            this.pos.y = map.height / 2;
        }
    }
};

function lineWrite(line, index, delay) {
    cutsceneLine.innerHTML = line.substring(0, ++index);
    
    if (index < line.length)
        setTimeout(() => lineWrite(line, index, delay), delay);
}

function lineClear() {
    cutsceneLine.innerHTML = '';
}

function zoomScreen(e) {
    let zoomInc = e.wheelDelta/1000;

    zoom += zoomInc;
}

function clear(color) {
    if (!color) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function rect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function text(x, y, font, color, text) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x - camera.pos.x + canvas.width/2, y - camera.pos.y + canvas.height/2);
}

function circle(x, y, radius, color) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

function lineTo(x, y, sx, sy, color, thickness) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.moveTo(x, y);
    ctx.lineTo(sx, sy);
    ctx.stroke();
}

function strokeCircle(x, y, radius, color, thickness) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.arc(x - camera.pos.x, y - camera.pos.y, radius, 0, 2*Math.PI);
    ctx.stroke();
    ctx.restore();
}

function background() {
    backImg.style.left = Math.round((-camera.pos.x * zoom) + canvas.width/2) + 'px';
    backImg.style.top = Math.round((-camera.pos.y * zoom) + canvas.height/2) + 'px';
    
    backImg.style.width = map.width * zoom + 'px';
    backImg.style.height = map.height * zoom + 'px';
}

function calcScreenCoords(obj) {
    return new Vector(Math.round(((obj.x - camera.pos.x) * zoom) + canvas.width/2), Math.round(((obj.y - camera.pos.y) * zoom) + canvas.height/2));
}

function drawObj(obj) {
    let screenCoords = calcScreenCoords(obj.pos);
    let x = screenCoords.x;
    let y = screenCoords.y;
    
    if (isOffscreen(screenCoords, obj.width * zoom, obj.height * zoom))
        return;
    if (obj.radius)
        circle(obj.pos.x, obj.pos.y, obj.radius, obj.color);
    else if (obj.angle !== undefined && obj.color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(obj.angle);
        rect(-obj.width * zoom / 2, -obj.height * zoom / 2, obj.width * zoom, obj.height * zoom, obj.color);
        ctx.restore();
    } else if (obj.angle !== undefined && obj.sprite) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(obj.angle);
        ctx.drawImage(obj.sprite, -obj.width * zoom / 2, -obj.height * zoom / 2, obj.width * zoom, obj.height * zoom);
        ctx.restore();
    } else if (obj.sprite) {
        ctx.drawImage(obj.sprite, x, y, obj.width * zoom, obj.height * zoom);
    } else {
        rect(x - obj.width * zoom / 2, y - obj.height * zoom / 2, obj.width * zoom, obj.height * zoom, obj.color);
    }
}

function createSprite(src) {
    let sprite = document.createElement("img");
    sprite.src = src;
    // sprite.crossOrigin = '';
    return sprite;
}

function grayscale() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
}

function die() {
    $('#you-died-wrapper').style.opacity = 1.0;
    $('#message').style.fontSize = `${Math.round(canvas.width / 11)}px`;
    
    $('#you-died-wrapper').style.boxShadow = `0px 0px ${Math.round(canvas.width / 17)}px ${Math.round(canvas.width / 34)}px rgba(0, 0, 0, 0.85)`;
    
    let deathTimeStop = setInterval(() => {
        if (delay < 100)
            delay++;
        else
            clearInterval(deathTimeStop);
    }, 16);
    
    clearSounds();
    playSound('sound/dead.mp3', 1.0);
}

function minimapDraw(x, y, width, height, color, angle) {
    m_ctx.fillStyle = color;
    if (angle !== undefined) {
        m_ctx.save();
        m_ctx.translate(x + width/2, y + height/2);
        m_ctx.rotate(angle);
        m_ctx.fillRect(-width / 2, -height / 2, width, height);
        m_ctx.restore();
    } else {
        m_ctx.fillRect(x, y, width, height);
    }
}

function minimapClear() {
    minimapDraw(0, 0, minimap.width, minimap.height, 'black');
}

function cinematic(yes) {
    if (yes) {
        $('#cinema-bar-top').style.height = '10%';
        $('#cinema-bar-bottom').style.height = '10%';
    } else {
        $('#cinema-bar-top').style.height = '10%';
        $('#cinema-bar-bottom').style.height = '10%';
    }
}