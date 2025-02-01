export class Pendulum {
    constructor() {
        this.theta = Math.PI / 2;
        this.v = 0;
        this.dt = 0.02;
        this.g = 9.81;
        this.l = 2.0;
        this.m = 1.0;
    }

    update(tau) {
        const a = (tau / (this.m * this.l ** 2)) + 
                 (this.g / this.l) * Math.sin(this.theta);
        this.v += a * this.dt;
        this.theta += this.v * this.dt;
    }

    reset() {
        this.theta = Math.PI / 2;
        this.v = 0;
    }
}