function $(s) {
    return document.querySelector(s);
}

function rad(a) {
    return a * Math.PI / 180;
}

function deg(a) {
    return a * 180 / Math.PI;
}

function log(a) {
    document.querySelector("#log").innerHTML = a;
}

function clearLog() {
    $("#log").innerHTML = "";
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function randColor() {
    return `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`;
}

function dist(obj1, obj2) {
    return Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
}

function blur(time, neededTime) {
    $('#main-menu').style.filter = 'url(#filter)';
    
    let value = (0.01/neededTime)*time*time;
    
    document.querySelectorAll('#filter feTurbulence')[0].setAttribute('baseFrequency', value + ' ' + value);
    
    // log(time);
    time++;
    
    if (time < neededTime)
        setTimeout(() => blur(time, neededTime), 1);
    else {
        document.querySelectorAll('#filter feTurbulence')[0].setAttribute('baseFrequency', '0 0');
        $('#main-menu').style.filter = 'none';
    }
    
    // log(document.querySelectorAll('#filter feTurbulence')[0].getAttribute('baseFrequency'));
}

function getAngle(obj1, obj2) {
    // lineTo(obj1.x, obj1.y, obj1.x, obj2.y, "red", 2);
    // lineTo(obj1.x, obj2.y, obj2.x, obj2.y, "blue", 2);
    // lineTo(obj1.x, obj1.y, obj2.x, obj2.y, "green", 2);
    return Math.atan2(obj1.y - obj2.y, obj1.x - obj2.x);
}

function resolveElasticCollision(b1, b2, elasticity) {
    let collisionAngle = getAngle(b1.pos, b2.pos);
    
    let collide_normal = new Vector(0, 1);
    collide_normal.setDir(collisionAngle);
    
    while (doPolygonsIntersect(getVertices(b1), getVertices(b2))) {
        b1.pos = b1.pos.add(collide_normal);
        b2.pos = b2.pos.subtract(collide_normal);
    }
    
    if (b1.turret)
        b1.turret.pos = b1.pos;
    if (b2.turret)
        b2.turret.pos = b2.pos;
    
    let n = new Vector(b2.pos.x - b1.pos.x, b2.pos.y - b1.pos.y);
    let un = n.divide(n.mag());
    let ut = new Vector(-un.y, un.x);
    
    let v1 = new Vector(b1.vel.x, b1.vel.y);
    let v2 = new Vector(b2.vel.x, b2.vel.y);
    
    let v1n = un.dot(v1);
    let v1t = ut.dot(v1);
    let v2n = un.dot(v2);
    let v2t = ut.dot(v2);
    
    let v1nf = ((v1n * (b1.mass - b2.mass)) + (2 * b2.mass * v2n)) / (b1.mass + b2.mass);
    let v1tf = v1t;
    let v2nf = ((v2n * (b2.mass - b1.mass)) + (2 * b1.mass * v1n)) / (b1.mass + b2.mass);
    let v2tf = v2t;
    
    let v1nfv = un.mult(v1nf * elasticity);
    let v1tfv = ut.mult(v1tf * elasticity);
    let v2nfv = un.mult(v2nf * elasticity);
    let v2tfv = ut.mult(v2tf * elasticity);
    
    b1.vel = v1nfv.add(v1tfv);
    b2.vel = v2nfv.add(v2tfv);
}

function resolveStaticCollision(d_obj, s_obj) { // dynamic Object and static Object
    // move dynamic Object out of static Object's hitbox in the direction of the d_obj's velocity vector
    let d_vel = d_obj.vel.mag();
    let d_dir = d_obj.vel.dir();
    
    let collisionAngle = getAngle(d_obj.pos, s_obj.pos);
    
    // if (collisionAngle >= s_obj.top_angle && collisionAngle <= s_obj.right_angle) {
    //     collisionAngle = getAngle(d_obj.bottomLeft, s_obj.pos);
    // } else if (collisionAngle <= s_obj.top_angle && collisionAngle >= s_obj.left_angle) {
    //     collisionAngle = getAngle(d_obj.bottomRight, s_obj.pos);
    // } else if (collisionAngle >= s_obj.bottom_angle && collisionAngle <= s_obj.left_angle) {
    //     collisionAngle = getAngle(d_obj.topRight, s_obj.pos);
    // } else if (collisionAngle <= s_obj.bottom_angle && collisionAngle >= s_obj.right_angle) {
    //     collisionAngle = getAngle(d_obj.topLeft, s_obj.pos);
    // }
    
    let collide_normal = new Vector(0, 1);
    collide_normal.setDir(collisionAngle);
    
    while (doPolygonsIntersect(getVertices(d_obj), s_obj.verts || getVertices(s_obj))) {
        d_obj.pos = d_obj.pos.add(collide_normal);
        
        if (!d_vel) {
            d_obj.vel.setMag(1);
            break;
        }
    }
    
    //when the objects are separate, move d_obj one more increment to keep them separate
    for (let i = 0;i < 3;i++) {
        d_obj.pos = d_obj.pos.subtract(d_obj.vel.normalize());
    }
    // if d_obj is a tank move turret as well
    if (d_obj instanceof Tank)
        d_obj.turret.pos = d_obj.pos;
    
    //get the diagonal's angle
    //used to determine the side of the collision
    
    // if the collisionAngle is between the diagonal angle and the negative diagonal angle (right side) or
    // the collisionAngle is between the previous range flipped across the y-axis (left side), then reverse the
    // x component of the velocity vector. If this is false (not left or right), it must be the top or bottom, so
    // the y component is reversed.
    
    // log(deg(s_obj.top_angle));
    if (collisionAngle <= s_obj.bottomRight && collisionAngle >= s_obj.topRight) {
        d_obj.vel.setDir(-d_obj.vel.dir() + ((Math.PI/2 - s_obj.right_angle) * 2));
    } else if (collisionAngle >= s_obj.bottomLeft || collisionAngle <= s_obj.topLeft) {
        d_obj.vel.setDir(-d_obj.vel.dir() + ((Math.PI/2 - s_obj.left_angle) * 2));
    } else if (collisionAngle >= s_obj.bottomRight && collisionAngle <= s_obj.bottomLeft) {
        d_obj.vel.setDir(-d_obj.vel.dir() + ((Math.PI/2 - s_obj.bottom_angle) * 2));
    } else if (collisionAngle <= s_obj.topRight && collisionAngle >= s_obj.topLeft) {
        d_obj.vel.setDir(-d_obj.vel.dir() + ((Math.PI/2 - s_obj.top_angle) * 2));
    }
    
    // log(`bounds: $ {deg(s_obj.topLeft)} to ${deg(s_obj.topRight)}\ncollisionAngle: ${deg(collisionAngle)}`);
}