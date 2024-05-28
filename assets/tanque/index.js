let startHealth = 200;
let player = new PlayerTank(300, 300, 64, 64, 300, 'img/player/tank/default/body.png', 'img/player/tank/default/turret.png', startHealth, 'player');
let delay = 0;
let demo = true;

window.onload = init;

function init() {
    canvas = $('#main');
    minimap = $('#minimap');
    ctx = canvas.getContext('2d');
    m_ctx = minimap.getContext('2d', { alpha: false });

    $('#play').onclick = start;
    backImg = $('#backImg');
    backImg.ondragstart = e => e.preventDefault();
    $('#message').style.fontSize = `${Math.round(canvas.width / 17)}px`;

    resize();

    cutsceneLine = $('#cutscene-line');
    //runCutscene('test');

    randomTank();

    camera.following = player;

    zoom = 1;
    mapResize(canvas.width, canvas.height);

    requestAnimationFrame(update);
}

function update(time) {
    clear();

    minimap.width = map.width / 5;
    minimap.height = map.height / 5;

    minimapClear();

    if (demo)
        player.health = startHealth;

    onPress(' ', () => cinematic(true));

    if (!player.dead) {
        if (player.canControl) {
            onHold('w', () => player.drive(1.0));
            onHold('s', () => player.drive(-0.5));
            onHold('a', () => player.rotate(-rad(5)));
            onHold('d', () => player.rotate(rad(5)));

            if (mouse.down && player.reload === 0) {
                player.shoot();
                player.reload = 30;
            }

            player.turret.angle = getAngle(player.pos, mouse.getMapPos()) + Math.PI;
        } else {
            if (Math.random() < 0.5) {
                if (nearestTank())
                    player.turret.angle = getAngle(player.pos, nearestTank().pos) + Math.PI;
                else
                    randomTank();
                let action = Math.random();
                if (action < 0.5)
                    player.ai('shoot', null, 0, 1);
                else if (action < 0.7)
                    player.ai('move', rand(0.5, 1.0), 0, rand(5, 20));
                else if (action < 0.8)
                    player.ai('move', rand(-0.5, -0.2), 0, rand(5, 20));
                else if (action < 1)
                    player.ai('rotate', rand(-0.04, 0.04), 0, rand(5, 20));
            }

            bullets.forEach(bullet => {
                if (!player.evading) {
                    player.evade(bullet.angle + Math.PI/2, rad(5), 1);
                }
            });
        }

        player.update();
    }

    barriers.forEach(barrier => {
        if (player && doPolygonsIntersect(player.verts, barrier.verts))
            resolveStaticCollision(player, barrier);

        for (let tank of tanks) {
            if (doPolygonsIntersect(tank.verts, barrier.verts))
                resolveStaticCollision(tank, barrier);
        }
    });

    particles.forEach(part => part.update());
    bullets.forEach(bullet => {
        for (let tank of tanks) {
            if (dist(tank.pos, bullet.pos) < tank.width + tank.height && doPolygonsIntersect(getVertices(tank), getVertices(bullet)) && bullet.id !== tank.id) {
                tank.health -= bullet.damage;
                tank.vel = tank.vel.add(bullet.vel.divide(10));
                for (let i = 0;i < 3;i++) {
                    let gray = rand(100, 150);
                    particles.push(new FallingParticle(
                        tank.pos.x, tank.pos.y, rand(4, 8), rand(4, 10), rand(-3, 3), rand(-3, 1), 0.9, 0.4, rand(0, 2*Math.PI), tank.pos.y + tank.height / 2, gray, gray, gray, 1, 50
                    ));
                }
                bullet.destroy();
            }
        }

        if (!player.dead && dist(player.pos, bullet.pos) < player.width + player.height && doPolygonsIntersect(getVertices(player), getVertices(bullet)) && bullet.id !== player.id) {
            player.health -= bullet.damage;
            player.vel = player.vel.add(bullet.vel.divide(2));
            for (let i = 0;i < 3;i++) {
                let gray = rand(100, 150);
                particles.push(new FallingParticle(
                    player.pos.x, player.pos.y, rand(4, 8), rand(4, 10), rand(-3, 3), rand(-3, 1), 0.9, 0.4, rand(0, 2*Math.PI), player.pos.y + player.height / 2, gray, gray, gray, 1, 50
                ));
            }
            bullet.destroy();
        }

        bullet.update();
    });

    tanks.forEach(tank => {
        if (rand(0.0, 1.0) < 0.05) {
            let action = rand(0.0, 1.0);
            if (action < 0.33) {
                if (player.dead)
                    tank.turretRotate(rand(0, 2*Math.PI), rand(0.01, 0.1));
                else if (!player.dead && tank.reload < 1)
                    tank.ai('shoot', null, 0, 1);
            }
            else if (action < 0.7)
                tank.ai('move', rand(0.5, 1.0), 0, rand(5, 20));
            else if (action < 0.8)
                tank.ai('move', rand(-0.5, -0.2), 0, rand(5, 20));
            else if (action < 1)
                tank.ai('rotate', rand(-0.04, 0.04), 0, rand(5, 20));
        }

        for (let bullet of bullets) {
            if (dist(bullet.pos, tank.pos) < tank.evadeDist && bullet.id == 'player') {
                if (!tank.evading) {
                    tank.evade(bullet.angle + Math.PI/2, rad(30), 1);
                }
            }
        }

        if (player && dist(player.pos, tank.pos) < tank.width + player.width) {
            if (doPolygonsIntersect(getVertices(player), getVertices(tank)))
                resolveElasticCollision(player, tank, 0.5);
        }

        tank.update();
    });

    camera.update();

    minimapDraw((camera.pos.x - canvas.width/(2 * zoom)) / (map.width / minimap.width), (camera.pos.y - canvas.height/(2 * zoom)) / (map.height / minimap.height), canvas.width / (zoom * 5), canvas.height / (zoom * 5), 'gray');

    background();

    if (!player.dead)
        player.draw();

    bullets.forEach(bullet => bullet.draw());
    tanks.forEach(tank => tank.draw());
    particles.forEach(particle => particle.draw());

    if (delay)
        setTimeout(() => requestAnimationFrame(update), delay);
    else
        requestAnimationFrame(update);
}

function randomTank() {
    tanks.push(new Tank(rand(0, map.width - 64), rand(0, map.height - 64), 64, 64, 30, 'img/enemy/tank/default/body.png', 'img/enemy/tank/default/turret.png', 50, Tank.randomID()));
}

function nearestTank() {
    let nearest;

    tanks.forEach(tank => {
        if (!nearest || dist(player.pos, tank.pos) < dist(player.pos, nearest.pos))
            nearest = tank;
    });

    return nearest;
}

function start() {
    demo = false;

    $('#main-menu-container').style.opacity = 0;

    playSound('tanqu.mp3', 1.0, true);

    player.canControl = true;

    blur(0, 1000);

    setTimeout(() => $('#main-menu-container').style.display = 'none', 1000);
}