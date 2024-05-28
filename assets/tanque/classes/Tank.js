let tanks = [];

class Tank {
    constructor(x, y, width, height, damage, sprite, turretSprite, health, id) {
        this.pos = new Vector(x, y);
        this.vel = new Vector();
        this.fric = 0.85;
        this.angle = 0;
        this.width = width;
        this.height = height;
        this.sprite = createSprite(sprite);
        this.reload = 0;
        this.reloadTime = 100;
        this.damage = damage;
        this.followPlayer = true;
        this.health = health;
        this.maxHealth = health;
        this.id = id;
        this.evadeDist = 200;
        this.evading = false;
        this.collideAngle = 0;

        this.halfWidth = this.width/2;
        this.halfHeight = this.height/2;

        this.topRight;
        this.topLeft;
        this.bottomRight;
        this.bottomLeft;
        // this.color = 'red';
        this.mass = 1;

        this.verts = [];

        this.turret = {
            pos: new Vector(this.pos.x, this.pos.y),
            width: this.width,
            height: this.height,
            sprite: createSprite(turretSprite),
            angle: 0
        };
    }

    destroy() {
        explode(this);
        if (!this.player)
            scores.push(new Score('+2', calcScreenCoords(this.pos).x - this.halfWidth, calcScreenCoords(this.pos).y - this.height, 50, 1, '40px', 'Comic Sans MS', 'red'));
        tanks.splice(tanks.indexOf(this), 1);
    }

    update() {
        this.verts = getVertices(this);

        this.pos = this.pos.add(this.vel);

        this.vel.scale(this.fric);

        if (this.reload > 0)
            this.reload--;

        if (this.pos.x < 0) {
            while (this.pos.x < 0) {
                this.pos.x++;
            }
        } else if (this.pos.x > map.width) {
            while (this.pos.x > map.width) {
                this.pos.x--;
            }
        } else if (this.pos.y < 0) {
            while (this.pos.y < 0) {
                this.pos.y++;
            }
        } else if (this.pos.y > map.height) {
            while (this.pos.y > map.height) {
                this.pos.y--;
            }
        }

        if (doPolygonsIntersect(this.verts, map.bounds.left)) {
            while (doPolygonsIntersect(this.verts, map.bounds.left)) {
                this.verts = getVertices(this);
                this.pos.x++;
            }

            this.vel.x *= -1;

            if (!this.player || !this.canControl)
                this.rotateTo(0, 0.2);
        } else if (doPolygonsIntersect(this.verts, map.bounds.right)) {
            while (doPolygonsIntersect(this.verts, map.bounds.right)) {
                this.verts = getVertices(this);
                this.pos.x--;
            }

            this.vel.x *= -1;

            if (!this.player || !this.canControl)
                this.rotateTo(Math.PI, 0.2);
        } else if (doPolygonsIntersect(this.verts, map.bounds.top)) {
            while (doPolygonsIntersect(this.verts, map.bounds.top)) {
                this.verts = getVertices(this);
                this.pos.y++;
            }

            this.vel.y *= -1;

            if (!this.player || !this.canControl)
                this.rotateTo(Math.PI/2, 0.2);
        } else if (doPolygonsIntersect(this.verts, map.bounds.bottom)) {
            while (doPolygonsIntersect(this.verts, map.bounds.bottom)) {
                this.verts = getVertices(this);
                this.pos.y--;
            }

            this.vel.y *= -1;

            if (!this.player || !this.canControl)
                this.rotateTo(-Math.PI/2, 0.2);
        }

        if (this.followPlayer && !player.dead)
            this.turret.angle = getAngle(player.pos, this.pos);

        this.turret.pos.x = this.pos.x;
        this.turret.pos.y = this.pos.y;

        this.collideAngle = this.angle;

        this.topRight = new Vector(this.pos.x + this.halfWidth, this.pos.y - this.halfHeight);
        this.topLeft = new Vector(this.pos.x - this.halfWidth, this.pos.y - this.halfHeight);
        this.bottomRight = new Vector(this.pos.x + this.halfWidth, this.pos.y + this.halfHeight);
        this.bottomLeft = new Vector(this.pos.x - this.halfWidth, this.pos.y + this.halfHeight);

        if (this.health <= 0)
            this.destroy();
    }

    draw() {
        drawObj(this);
        drawObj(this.turret);

        if (this.health < this.maxHealth / 4) {
            particles.push(new Particle(
                this.pos.x,
                this.pos.y,
                this.width/4,
                this.height/4,
                rand(-0.5, 0.5),
                rand(-2, -4),
                rand(0, 2*Math.PI),
                rand(-0.1, 0.1),
                rand(1.01, 1.02),
                rand(1.01, 1.02),
                255,
                rand(50, 128),
                0,
                rand(0.3, 0.4),
                rand(20, 22)
            ));
            particles.push(new Particle(
                this.pos.x,
                this.pos.y,
                this.width/3,
                this.height/3,
                rand(-1.5, 1.5),
                rand(-3, -7),
                rand(0, 2*Math.PI),
                rand(-0.1, 0.1),
                rand(1.01, 1.02),
                rand(1.01, 1.02),
                0,
                0,
                0,
                rand(0.03, 0.05),
                rand(20, 22)
            ));
        }

        minimapDraw((this.pos.x - this.halfWidth) / (map.width / minimap.width), (this.pos.y - this.halfHeight) / (map.height / minimap.height), this.width / (map.width / minimap.width), this.height / (map.height / minimap.height), this.player ? 'blue' : 'red', this.angle);
    }

    drive(speed) {
        let speedVec = new Vector(speed, 0);

        if (speed < 0)
            speedVec.setDir(this.angle + Math.PI);
        else
            speedVec.setDir(this.angle);

        this.vel = this.vel.add(speedVec);

        let lightness = rand(0, 50);

        particles.push(new Particle(
            this.pos.x - ((this.width/3)*Math.sin(this.angle)),
            this.pos.y + ((this.height/3)*Math.cos(this.angle)),
            this.width / 16,
            this.height / 6.4,
            0,
            0,
            this.angle,
            0,
            1,
            1,
            lightness,
            lightness,
            lightness,
            rand(0.2, 0.3),
            rand(24, 32)
        ));

        particles.push(new Particle(
            this.pos.x + ((this.width/3)*Math.sin(this.angle)),
            this.pos.y - ((this.height/3)*Math.cos(this.angle)),
            this.width / 16,
            this.height / 6.4,
            0,
            0,
            this.angle,
            0,
            1,
            1,
            lightness,
            lightness,
            lightness,
            rand(0.2, 0.3),
            rand(24, 32)
        ));

        let loops = (this.maxHealth / 1) /this.health;
        loops = loops === Infinity ? 0 : Math.floor(loops);

        for (let i = 0;i < loops;i++) {
            particles.push(new Particle(
                this.pos.x,
                this.pos.y,
                this.width/3,
                this.height/3,
                rand(-1.5, 1.5),
                rand(-3, -7),
                rand(0, 2*Math.PI),
                rand(-0.1, 0.1),
                rand(1.01, 1.02),
                rand(1.01, 1.02),
                this.health,
                this.health,
                this.health,
                rand(0.03, 0.05),
                rand(30, 32)
            ));
        }

    }

    rotate(angle) {
        this.angle += angle;
    }

    shoot() {
        playSound('sound/pew.mp3', 0.5);

        bullets.push(new Bullet(this.pos.x + Math.cos(this.turret.angle) * this.width / 2, this.pos.y + Math.sin(this.turret.angle) * this.height / 2, this.turret.angle, this.id, rand(this.damage - 5, this.damage + 5), 'black', 20, 4));

        for (let i = 0;i < 10;i++) {
            particles.push(new Particle(
                (this.pos.x - 10) + 22*Math.sin(this.turret.angle),
                (this.pos.y - 10) - 22*Math.cos(this.turret.angle),
                rand(6, 10),
                rand(6, 10),
                rand(-5*Math.cos(this.turret.angle), -5*Math.cos(this.turret.angle)),
                rand(-7*Math.sin(this.turret.angle), -7*Math.sin(this.turret.angle)),
                rand(0, 360),
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

    evade(angle, rotateSpeed, speed) {
        // log(this.evading);
        this.evading = true;
        this.rotateTo(angle, rotateSpeed, () => {
            this.ai('move', speed, 0, speed * 10, () => {
                this.evading = false;
            });
        });
    }

    rotateTo(angle, speed, callback = null) {
        if (this.angle <= angle)
            this.rotate(speed);
        else
            this.rotate(-speed);

        if (this.angle <= angle + speed && this.angle >= angle - speed) {
            if (callback)
                callback();
        } else
            setTimeout(() => this.rotateTo(angle, speed, callback), 16);
    }

    turretRotate(angle, speed, callback = null) {
        if (this.turret.angle <= angle)
            this.turret.angle += speed;
        else
            this.turret.angle -= speed;

        if (this.turret.angle <= angle + speed && this.turret.angle >= angle - speed) {
            if (callback)
                callback();
        } else
            setTimeout(() => this.turretRotate(angle, speed, callback), 16);
    }

    ai(action, value, time, length, callback = null) {
        if (action === 'move') {
            this.drive(value);
        } else if (action === 'rotate') {
            this.rotate(value);
        } else if (action === 'shoot' && this.reload === 0) {
            this.shoot();
            this.reload = this.reloadTime;
        }
        time++;

        if (time < length)
            setTimeout(() => this.ai(action, value, time, length, callback), 16);
        else {
            if (callback)
                callback();
        }
    }
}

Tank.randomID = function() {
    return Math.random().toString(36).slice(2);
};