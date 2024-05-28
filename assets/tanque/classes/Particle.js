let particles = [];

class Particle {
    constructor(x, y, width, height, xVel, yVel, angle, spin, stretchX, stretchY, r, g, b, a, lifetime) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(xVel, yVel);
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.spin = spin;
        this.stretchX = stretchX;
        this.stretchY = stretchY;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.color = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
        this.lifetime = lifetime;
        this.timealive = 0;
    }

    destroy() {
        particles.splice(particles.indexOf(this), 1);
    }

    draw() {
        drawObj(this);
    }

    update() {
        this.pos = this.pos.add(this.vel);
        this.angle += this.spin;
        this.timealive++;
        this.color = `rgba(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)},${this.a})`;

        this.width *= this.stretchX;
        this.height *= this.stretchY;

        if (this.timealive > this.lifetime)
            this.destroy();
        if (this.timealive > this.lifetime - 10)
            this.a -= 0.1;

        if (isOffscreen(calcScreenCoords(this.pos), this.width, this.height))
            this.destroy();
    }
}

function explode(obj) {
    for (let i = 0;i < 30;i++) {
        let randomAngle2 = rand(0, -Math.PI);
        particles.push(new FallingParticle(
            obj.pos.x,
            obj.pos.y,
            rand(3, 6),
            rand(6, 10),
            rand(Math.cos(randomAngle2)*3, Math.cos(randomAngle2)*5),
            rand(Math.sin(randomAngle2)*6, Math.sin(randomAngle2)*4),
            0.99,
            0.1,
            rand(0, 2*Math.PI),
            obj.pos.y + obj.width/2,
            255,
            rand(80, 140),
            0,
            1,
            rand(50, 60)
        ));
        let randomAngle3 = rand(0, 2*Math.PI);
        particles.push(new FallingParticle(
            obj.pos.x,
            obj.pos.y,
            rand(3, 7),
            rand(3, 7),
            rand(Math.cos(randomAngle3)*2, Math.cos(randomAngle3)*3),
            rand(Math.sin(randomAngle3)*3, Math.sin(randomAngle3)*4),
            0.99,
            0.1,
            rand(0, 2*Math.PI),
            obj.pos.y + obj.width/2,
            255,
            rand(30, 100),
            0,
            1,
            rand(40, 50)
        ));
    }
}
