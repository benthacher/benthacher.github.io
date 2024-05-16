class Joint {
    constructor(x, y, r, c) {
        this.x = x;
        this.y = y;
        this.ix = x;
        this.iy = y;
        this.fx = x;
        this.fy = y;
        this.dTheta = 0;
        this.r = r || JOINT_RADIUS;
        this.c = c || `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    }

    draw() {
        circle(this.x, this.y, this.r, this.c);
    }
}