let mouse = {
    pos: new Vector(),
    width: 0,
    height: 0,
    down: false,
    getMapPos: function() {
        return new Vector(((this.pos.x - (canvas.width/2)) / zoom) + camera.pos.x, ((this.pos.y - (canvas.height/2)) / zoom) + camera.pos.y);
    }
};

let keys = {};

window.onresize = resize;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let msg = $('#message');
    msg.style.transitionDuration = '0';
    msg.style.fontSize = `${Math.round(canvas.width / 11)}px`;
    msg.style.transitionDuration = '3s';
    
    if (demo) {
        mapResize(canvas.width, canvas.height);
    }
}

window.onmousemove = e => {
    mouse.pos.x = e.x;
    mouse.pos.y = e.y;
};

window.addEventListener('DOMMouseScroll',zoomScreen,false);
window.addEventListener('mousewheel',zoomScreen,false);

window.onmousedown = e => mouse.down = true;
window.onmouseup = e => mouse.down = false;

window.onkeydown = e => {
    if (!keys[e.key])
        keys[e.key] = {};
    keys[e.key].pressed = true;
};

window.onkeyup = e => {
    if (!keys[e.key])
        keys[e.key] = {};
    keys[e.key].pressed = false;
    keys[e.key].canBePressed = true;
};

function onPress(key, callback) {
    if (keys[key] && keys[key].pressed && keys[key].canBePressed) {
        callback();
        keys[key].canBePressed = false;
    }
}

function onClick(callback) {
    if (mouse.down) {
        callback();
    }
}

function onRelease(callback) {
    if (!mouse.down) {
        callback();
    }
}

function onHold(key, callback) {
    if (keys[key] && keys[key].pressed)
        callback();
}

function onCollide(obj1, obj2, callback) {
    if (isColliding(obj1, obj2))
        callback();
}

function isColliding(obj1, obj2) {
    return  obj1.pos.x - obj1.width/2 < obj2.pos.x + obj2.width/2 &&
            obj1.pos.x + obj1.width/2 > obj2.pos.x - obj2.width/2 &&
            obj1.pos.y - obj1.height/2 < obj2.pos.y + obj2.height/2 &&
            obj1.pos.y + obj1.height/2 > obj2.pos.y - obj2.height/2;
}

function isOffscreen(pos, width, height) {
    return (pos.x < -width || pos.y < -height || pos.x > canvas.width + width || pos.y > canvas.height + height);
}

function getVertices(o) {
    let di = Math.sqrt(((o.width*o.width)/4) + ((o.height*o.height)/4));
    let a1 = o.collideAngle - (Math.atan(o.height/o.width));
    let a2 = o.collideAngle - (Math.atan(-o.height/o.width));
    let v1 = new Vector(di*Math.cos(a1), di*Math.sin(a1));
    let v2 = new Vector(di*Math.cos(a2), di*Math.sin(a2));
    
    return [o.pos.add(v1),
            o.pos.add(v2),
            o.pos.add(v1.mult(-1)),
            o.pos.add(v2.mult(-1))];
}

function doPolygonsIntersect(a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;
    
    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = new Vector(p2.y - p1.y, p1.x - p2.x);

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (!(minA) || projected < minA) {
                    minA = projected;
                }
                if (!(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            
            minB = undefined;
            maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (!(minB) || projected < minB) {
                    minB = projected;
                }
                if (!(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                // log("polygons don't intersect!");
                return false;
            }
        }
    }
    return true;
}