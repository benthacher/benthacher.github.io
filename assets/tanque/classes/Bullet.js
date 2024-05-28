let bullets = [];
const bulletSpeed = 20;

class Bullet {
    constructor(x, y, angle, id, damage, color, width, height) {
        this.pos = new Vector(x, y);
        this.vel = new Vector();
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.color = color;
        this.id = id;
        this.damage = damage;
        this.vel.setMag(bulletSpeed);
        this.vel.setDir(this.angle);
    }

    destroy() {
        bullets.splice(bullets.indexOf(this), 1);
    }

    update() {
        this.pos = this.pos.add(this.vel);

        if (this.pos.x < 0 || this.pos.x > map.width || this.pos.y < 0 || this.pos.y > map.height) {
            if (this.id === 'player')
                tanks.push(new Tank(rand(0, map.width - 64), rand(0, map.height - 64), 64, 64, 30, 'https://i.imgur.com/5htJaEh.png?1', 'https://i.imgur.com/C4q66Ow.png', 50, Tank.randomID()));
            this.destroy();
        }

        this.vel.setMag(bulletSpeed);
        this.vel.setDir(this.angle);
    }

    draw() {
        drawObj(this);
    }
}
