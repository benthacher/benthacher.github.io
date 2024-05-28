let barriers = [];

class Barrier {
    constructor(x, y, width, height, angle, color) {
        this.pos = new Vector(x, y);
        this.width = width;
        this.height = height;
        this.color = color;
        this.angle = angle;
        this.collideAngle = angle;
        this.diagonal = new Vector(this.width, this.height);
        this.diagonalHalfLength = this.diagonal.mag() / 2;
        this.diagonalAngle = this.diagonal.dir();

        this.topRight = -this.diagonalAngle + this.collideAngle;
        this.topLeft = -Math.PI + this.diagonalAngle + this.collideAngle;
        this.bottomRight = this.diagonalAngle + this.collideAngle;
        this.bottomLeft = Math.PI - this.diagonalAngle + this.collideAngle;

        this.top_angle = -Math.PI/2 - this.collideAngle;
        this.left_angle = -Math.PI - this.collideAngle;
        this.bottom_angle = Math.PI/2 - this.collideAngle;
        this.right_angle = -this.collideAngle;

        this.mass = 0.5;

        this.verts = getVertices(this);
    }

    draw() {
        drawObj(this);
    }
}