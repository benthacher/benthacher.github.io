class PlayerTank extends Tank {
    constructor(x, y, width, height, damage, sprite, turretSprite, health, id) {
        super(x, y, width, height, damage, sprite, turretSprite, health, id);
        this.followPlayer = false;
        this.dead = false;
        this.player = true;
        this.mass = 1;
        this.health = health;
        this.canControl = false;
    }

    destroy() {
        explode(this);
        this.dead = true;
        die();
    }

    shoot() {
        playSound('sound/pew.mp3', 0.5);

        bullets.push(new Bullet(this.pos.x + Math.cos(this.turret.angle) * this.width / 3, this.pos.y + Math.sin(this.turret.angle) * this.height / 3, this.turret.angle, this.id, rand(this.damage - 5, this.damage + 5), 'black', 20, 4));

        particles.push(new FallingParticle(
            this.pos.x, this.pos.y, rand(9, 11), rand(2, 3), rand(-3, 3), rand(-3, 1), 0.9, 0.4, rand(-0.1, 0.1), this.pos.y + this.height / 2, 100, 100, 0, 1, 50
        ));

        for (let i = 0;i < 10;i++) {
            particles.push(new Particle(
                this.pos.x + this.width*Math.cos(this.turret.angle)/2,
                this.pos.y + this.height*Math.sin(this.turret.angle)/2,
                rand(6, 10),
                rand(6, 10),
                rand(5*Math.cos(this.turret.angle), 5*Math.cos(this.turret.angle)),
                rand(7*Math.sin(this.turret.angle), 7*Math.sin(this.turret.angle)),
                rand(0, 2*Math.PI),
                rand(-10, 10),
                1.2,
                1.2,
                255,
                rand(49, 89),
                0,
                rand(0.5, 0.7),
                rand(6, 4)
            ));
        }
    }


}
