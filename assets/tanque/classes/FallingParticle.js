class FallingParticle extends Particle {
    constructor(x, y, width, height, xVel, yVel, fric, grav, angle, floor, r, g, b, a, lifetime) {
        super(x, y, width, height, xVel, yVel, angle, 0, 1, 1, r, g, b, a, lifetime);
        this.fric = fric;
        this.grav = grav;
        this.floor = floor;
    }

    update() {
        if (this.pos.y > this.floor) {
            this.vel.y *= -1;
            this.pos.y -= this.height/2;
        }
        this.vel.scale(this.fric);
        this.vel.y += this.grav;

        this.pos = this.pos.add(this.vel);

        this.timealive++;

        if (this.timealive > this.lifetime)
            this.destroy();
        if (this.timealive > this.lifetime - 10) {
            this.a -= 0.1;
            this.color = `rgba(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)},${this.a})`;
        }

        if (isOffscreen(calcScreenCoords(this.pos), this.width, this.height))
            this.destroy();
    }
}
