// takes two Joints
function isColliding(j1, j2) {
    return dist(j1, j2) < (j1.r + j2.r);
}

function isBounded(x1, y1, x2, y2, x3, y3, r) {
    return (x2 + r > x3 && x3 > x1 - r) &&
           (y2 + r > y3 && y3 > y1 - r);
}

function isCollidingBala(x1, y1, x2, y2, x3, y3, r) {
    if (!isBounded(x1, y1, x2, y2, x3, y3, r))
        return false;

    let a12 = getAngle(x1, y1, x2, y2);
    let a13 = getAngle(x1, y1, x3, y3);
    let theta = a12 - a13;

    let dist13 = dist(x1, y1, x3, y3);

    let height = dist13 * Math.sin(theta);

    if (height < 0 && -height < r)
        return -1;
    else if (height > 0 && height < r)
        return 1;
    else
        return 0;
}

function getAngle(a, b, c, d) {
    // a and b are two joints or anything with x and y components
    if (!c && !d)
        return Math.atan2(b.y - a.y, b.x - a.x);
    else
        return Math.atan2(d - b, c - a);
}

function dist(a, b, c, d) {
    // a and b are two joints or anything with x and y components
    if (!c && !d)
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    else // a, b, c, d are x1, y1, x2, y2
        return Math.sqrt((c - a) ** 2 + (d - b) ** 2);
}

function resolveCollision(j1, j2) {
    let collisionAngle = getAngle(j1, j2);

    while (isColliding(j1, j2)) {
        j1.x -= Math.cos(collisionAngle);
        j1.y -= Math.sin(collisionAngle);
        
        j2.x += Math.cos(collisionAngle);
        j2.y += Math.sin(collisionAngle);

        if (j1.isMid) {
            j1.j1.x -= Math.cos(collisionAngle);
            j1.j1.y -= Math.sin(collisionAngle);
            
            j1.j2.x -= Math.cos(collisionAngle);
            j1.j2.y -= Math.sin(collisionAngle);
        } else if (j2.isMid) {
            j2.j1.x += Math.cos(collisionAngle);
            j2.j1.y += Math.sin(collisionAngle);
            
            j2.j2.x += Math.cos(collisionAngle);
            j2.j2.y += Math.sin(collisionAngle);
        }
    }
}

function vec_dot(j1, j2) {
    return j1.x * j2.x + j1.y * j2.y;
}

function vec_sub(j1, j2) {
    return { x: j1.x - j2.x, y: j1.y - j2.y };
}

function vec_get_mag(v) {
    return Math.hypot(v.x, v.y);
}

function vec_get_dir(v) {
    return Math.atan2(v.y, v.x);
}


function vec_set_dir(vec, a) {
	l = vec_get_mag(vec)

	vec.x = l * Math.cos(a)
	vec.y = l * Math.sin(a)

	return vec
}

function vec_set_mag(vec, l) {
    a = vec_get_dir(vec)
    
    vec.x = l * Math.cos(a)
    vec.y = l * Math.sin(a)
    
    return vec
}

function resolveSegmentCollision(i1, i2, i3, j1, j2, j3) {
    const r = JOINT_RADIUS;
    const seg_width = r;

    p1 = vec_sub(j3, j1)       
    p1_mag = vec_get_mag(p1)  
    p2 = vec_sub(j3, j2)        
    p2_mag = vec_get_mag(p2) 

    d = vec_sub(j2, j1)       
    d_mag = vec_get_mag(d)  

    proj_mag = vec_dot(d, p1) / d_mag
    normal_mag = Math.sqrt(p1_mag ** 2 - proj_mag ** 2);

    cos_theta_j1 = proj_mag       /          p1_mag
    cos_theta_j2 = vec_dot(d, p2) / (d_mag * p2_mag)

    if (normal_mag < seg_width + r && cos_theta_j1 > 0 && cos_theta_j2 < 0) {
        d_dir = vec_get_dir(d);
        a = d_dir + (Math.PI / 2) * (d_dir > vec_get_dir(p1) ? 1 : -1);

        _dist = seg_width + r - normal_mag;

        j3.x -= _dist * Math.cos(a);
        j3.y -= _dist * Math.sin(a);
    }
}

function resolveBalaCollision(x1, y1, x2, y2, j, r) {
    let dir = isCollidingBala(x1, y1, x2, y2, j.x, j.y, r);
    let collisionAngle = getAngle(x1, y1, x2, y2) - Math.PI/2 * dir;

    while (isCollidingBala(x1, y1, x2, y2, j.x, j.y, r)) {
        j.x += Math.cos(collisionAngle);
        j.y += Math.sin(collisionAngle);
    }
}

function noMotion() {
    let precision = 4;

    joints.forEach(joint => {
        // if (round(joint.x, precision) !== round(joint.prevX, precision) || 
        //     round(joint.y, precision) !== round(joint.prevY, precision))
        if (joint.x !== joint.prevX ||
            joint.y !== joint.prevY)
                return false;
    });
    return false;
}

function round(n, d) {
    return Math.round(n * (10 ** d)) / (10 ** d);
}

function midpoint(j1, j2) {
    return {
        x: (j2.x + j1.x) / 2,
        y: (j2.y + j1.y) / 2, 
        r: MIDPOINT_RADIUS,
        j1,
        j2,
        isMid: true
    };
}