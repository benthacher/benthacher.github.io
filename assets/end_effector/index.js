const FPS = 60;
const JOINT_RADIUS = 20;
let SEGMENT_LENGTH = 100;
let NUM_JOINTS = 4;

let mr = (SEGMENT_LENGTH - (JOINT_RADIUS * 2)) / 1 - 0.1;
const MIDPOINT_RADIUS = mr < 0 ? -mr : mr;
let EXTENDED_LENGTH = (NUM_JOINTS - 1) * SEGMENT_LENGTH;

let joints = [];
let lastJoints = [];
const numLerps = 40;
let origin;
let originJoint;
let mouseControl;

let desiredAngle = 0;

let speed = 3;

const { PI } = Math;

const maxResolves = 20;
let resolves = 0;

function lengthChange() {
    SEGMENT_LENGTH = parseInt(document.querySelector('#length').value);
}

function init() {
    resize();

    joints = [];
    NUM_JOINTS = parseInt(document.querySelector('#num-joints').value)

    for (let i = 0; i < NUM_JOINTS; i++)
        joints.push(new Joint((canvas.width / 2) + i * 100, canvas.height / 2));

    origin = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    originJoint = joints[0];
    mouseControl = joints[joints.length - 1];

    document.querySelector('#length').onchange = lengthChange;
    document.querySelector('#num-joints').onchange = init;

    lengthChange();

    loop();
}

function loop() {
    events();

    while (resolves < maxResolves && !noMotion()) {
        physics();

        resolves++;
    }

    resolves = 0;

    draw();
    physics();

    setTimeout(loop, 1000 / FPS);
}

function events() {
    if (navigator.getGamepads()[2]) {
        gp = navigator.getGamepads()[2];

        mouse.dx = gp.axes[2] * speed;
        mouse.dy = gp.axes[3] * speed;
        console.log(gp.axes[0]);
        if (Math.abs(gp.axes[0]) > 0.1) {
            speed += gp.axes[0] / 10;
            document.querySelector('#speed').value = speed;
        }
    }

    if (keys['w'])
        mouse.dy -= speed;
    if (keys['s'])
        mouse.dy += speed;
    if (keys['a'])
        mouse.dx -= speed;
    if (keys['d'])
        mouse.dx += speed;

    if (keys['ArrowLeft'])
        desiredAngle -= 0.1;
    if (keys['ArrowRight'])
        desiredAngle += 0.1;

    speed = Math.max(speed, 0);
    speed = Math.min(speed, 10);

    // if distance mouse is away from base is greater than arm length, normalize it
    if (Math.hypot(mouse.x - originJoint.x, mouse.y - originJoint.y) > NUM_JOINTS * SEGMENT_LENGTH) {
        let a = getAngle(mouse, originJoint);

        // mouse coords                arm length
        mouse.x = originJoint.x - (NUM_JOINTS * SEGMENT_LENGTH) * Math.cos(a);
        mouse.y = originJoint.y - (NUM_JOINTS * SEGMENT_LENGTH) * Math.sin(a);
    }
}

const lerp = (v0, v1, t) => v0*(1-t)+v1*t;

async function physics() {

    mouse.x += mouse.dx;
    mouse.y += mouse.dy;
    mouse.dx *= 0.8;
    mouse.dy *= 0.8;

    mouseControl.ix = mouseControl.x;
    mouseControl.iy = mouseControl.y;

    mouseControl.fx = mouse.x;
    mouseControl.fy = mouse.y;

    if (mouseControl.fy > originJoint.y) {
        mouseControl.fy = originJoint.y;
    }


    for (let i = 1; i <= numLerps; i++) {

        let t = i / numLerps;

        mouseControl.x = lerp(mouseControl.ix, mouseControl.fx, t);
        mouseControl.y = lerp(mouseControl.iy, mouseControl.fy, t);

        for (let i = joints.length - 1; i >= 1; i--) {

            let joint = joints[i];
            let next = joints[i - 1];

            let a = getAngle(joint, next);
            let l = SEGMENT_LENGTH;

            next.x = joint.x + l * Math.cos(a);
            next.y = joint.y + l * Math.sin(a);
        }

        originJoint.x = origin.x;
        originJoint.y = origin.y;

        for (let i = 0; i < joints.length - 1; i++) {

            let joint = joints[i];
            let next = joints[i + 1];

            let a = getAngle(joint, next);
            let l = SEGMENT_LENGTH;

            next.x = joint.x + l * Math.cos(a);
            next.y = joint.y + l * Math.sin(a);
        }

        // resolve collisions

        for (let i = 0; i < joints.length - 1; i++) {

            let joint = joints[i];

            for (let other of joints) {
                if (other == joint)
                    continue;

                if (isColliding(joint, other))
                    resolveCollision(joint, other);
            }

            if (joint.y > originJoint.y) {
                joint.y = originJoint.y;
            }
        }
        for (let i = 0; i < NUM_JOINTS; i++) {
            if (i > 2) {
                for (let j = 0; j < i - 2; j++) {
                    resolveSegmentCollision(j, j+1, i, joints[j], joints[j + 1], joints[i])
                }
            }

            if (i < NUM_JOINTS - 3) {
                for (let j = i + 2; j < NUM_JOINTS - 1; j++) {
                    resolveSegmentCollision(j, j + 1, i, joints[j], joints[j + 1], joints[i])
                }
            }
        }

        originJoint.x = origin.x;
        originJoint.y = origin.y;
    }
}

function draw() {
    clear();

    rect((canvas.width - (EXTENDED_LENGTH * 2)) / 2, originJoint.y + originJoint.r, EXTENDED_LENGTH * 2, canvas.height - originJoint.y + originJoint.r, 'grey');

    joints.forEach(joint => joint.draw());

    for (let i = 0; i < joints.length - 1; i++) {
        let joint = joints[i];
        let next = joints[i + 1];
        line(joint.x, joint.y, next.x, next.y, 'red', 4);
    }

    circle(mouse.x, mouse.y, 4, 'black');
}

const wait = ms => new Promise((resolve => setTimeout(resolve, ms)));

init();