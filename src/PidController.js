import { clamp } from './Utilities.js';

export class PIDController {
    constructor(kp = 50, ki = 50, kd = 50, dt = 0.02, maxOutput = 30) {
        this.kp = kp;
        this.ki = ki;
        this.kd = kd;
        this.dt = dt;
        this.maxOutput = maxOutput;
        this.integral = 0;
        this.lastError = 0;
        this.setpoint = 0;
    }

    computePID(input) {
        const error = this.setpoint - input;
        this.integral += error * this.dt;
        this.integral = clamp(this.integral, -this.maxOutput, this.maxOutput);
        
        const derivative = (error - this.lastError) / this.dt;
        this.lastError = error;

        let output = this.kp * error + 
                    this.ki * this.integral + 
                    this.kd * derivative;

        return clamp(output, -this.maxOutput, this.maxOutput);
    }

    setKp(kp) { this.kp = kp; }
    setKi(ki) { this.ki = ki; }
    setKd(kd) { this.kd = kd; }
}