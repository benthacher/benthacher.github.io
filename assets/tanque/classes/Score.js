let scores = [];

class Score {
    constructor(text, x, y, height, speed, fontSize, fontFamily, color) {
        this.elementWrapper = document.createElement('div');
        this.element = document.createElement('p');
        this.element.innerHTML = text;

        this.speed = speed;
        this.height = height;

        this.elementWrapper.style.position = 'absolute';
        this.elementWrapper.style.left = x + 'px';
        this.elementWrapper.style.top = y + 'px';
        this.elementWrapper.style.zIndex = 1000;
        this.elementWrapper.style.transition = `top ${this.speed}s linear`;

        this.element.style.fontSize = fontSize;
        this.element.style.fontFamily = fontFamily;
        this.element.style.color = color;
        this.element.style.opacity = 1.0;
        this.element.style.transition = `opacity ${this.speed / 3}s linear ${this.speed - (this.speed / 3)}s`;

        this.elementWrapper.appendChild(this.element);
        document.body.appendChild(this.elementWrapper);

        setTimeout(() => {
            this.elementWrapper.style.top = y - this.height + 'px';
            this.element.style.opacity = 0.0;
        }, 1);

        setTimeout(() => this.remove(), (this.speed * 1000));
    }

    remove() {
        document.body.removeChild(this.elementWrapper);
        scores.splice(scores.indexOf(this), 1);
    }

    color(color) {
        this.element.style.color = color;
    }
}