class Line {
    constructor(text, cameraPos, time) {
        this.text = text;
        this.cameraPos = cameraPos;
        this.time = time;
    }
}

let cutscenes = {
    test: {
        script: [
            new Line('ya yeet', new Vector(500, 500), 1000),
            new Line('shit on me', undefined, 1000),
//            new Line('shoot boyo', player.pos, 1000),
            new Line('o shit dawg', undefined, 1000)
        ],
        speed: 10
    }
};

function runCutscene(name) {
    cinematic();

    let cutscene = cutscenes[name];
    let script = cutscene.script;
    let speed = cutscene.speed;

    script.reduce((p, currentLine, _) =>
        p.then(_ => new Promise(resolve =>
            setTimeout(() => {
                camera.following = currentLine.cameraPos ? currentLine.cameraPos : camera.pos;
                lineWrite(currentLine.text, 0, speed);
                resolve();
            }, currentLine.time)
        ))
    , Promise.resolve());
}
