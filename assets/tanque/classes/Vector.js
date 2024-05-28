class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    setVec(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }

    normalize() {
        let mag = this.mag();

        return new Vector(this.x / this.mag(), this.y / this.mag());
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    scale(factor) {
        this.x *= factor;
        this.y *= factor;
    }

    divide(factor) {
        return new Vector(this.x / factor, this.y / factor);
    }

    mult(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    mag() {
        return Math.hypot(this.x, this.y);
    }

    dir() {
        return Math.atan2(this.y, this.x);
    }

    setMag(m) {
        let angle = this.dir();

        this.x = m * Math.cos(angle);
        this.y = m * Math.sin(angle);
    }

    setDir(d) {
        let magnitude = this.mag();

        this.x = magnitude * Math.cos(d);
        this.y = magnitude * Math.sin(d);
    }

    toString() {
        return `[${this.x.toFixed(3)},${this.y.toFixed(3)}]`;
    }
}