    import { PIDController } from './PidController.js';
    import { Pendulum } from './Pendulum.js';

    class SimulationUI {
        constructor() {
            this.canvas = document.getElementById('mycanvas');
            this.ctx = this.canvas.getContext('2d');
            this.pendulum = new Pendulum();
            this.controller = new PIDController(300, 20, 500, 0.02, 30);
            this.pidEnabled = false;

            this.pendulumLength = 300;
            this.pendulumWidth = 10;
            this.platformHeight = 15;
            this.platformLength = 200;
            
            this.initControls();
            this.startAnimation();
        }

        initControls() {
            // PID Toggle
            document.getElementById('togglePID').addEventListener('click', () => {
                this.pidEnabled = !this.pidEnabled;
                document.getElementById('togglePID').textContent = 
                    `PID: ${this.pidEnabled ? 'ON' : 'OFF'}`;
            });

            // KP
            const kpNumber = document.getElementById('kp');
            const kpRange = document.getElementById('kpRange');
            
            const updateKP = (value) => {
                const numValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                this.controller.setKp(numValue);
                kpNumber.value = numValue;
                kpRange.value = numValue;
            };

            kpNumber.addEventListener('input', (e) => updateKP(e.target.value));
            kpRange.addEventListener('input', (e) => updateKP(e.target.value));

            // KI
            const kiNumber = document.getElementById('ki');
            const kiRange = document.getElementById('kiRange');
            
            const updateKI = (value) => {
                const numValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                this.controller.setKi(numValue);
                kiNumber.value = numValue;
                kiRange.value = numValue;
            };

            kiNumber.addEventListener('input', (e) => updateKI(e.target.value));
            kiRange.addEventListener('input', (e) => updateKI(e.target.value));

            // KD
            const kdNumber = document.getElementById('kd');
            const kdRange = document.getElementById('kdRange');
            
            const updateKD = (value) => {
                const numValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                this.controller.setKd(numValue);
                kdNumber.value = numValue;
                kdRange.value = numValue;
            };

            kdNumber.addEventListener('input', (e) => updateKD(e.target.value));
            kdRange.addEventListener('input', (e) => updateKD(e.target.value));

            // Setpoint Control
            document.getElementById('setpoint').addEventListener('input', (e) => {
                const setpointValue = isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value);
                this.controller.setpoint = setpointValue;   });

            // Reset Button
            document.getElementById('reset').addEventListener('click', () => {
                this.pendulum.reset();
            });
        }

        startAnimation() {
            const animate = () => {
                this.updatePhysics();
                this.draw();
                requestAnimationFrame(animate);
            };
            animate();
        }

        updatePhysics() {
            this.tau = 0;
            if (this.pidEnabled) {
                this.tau = this.controller.computePID(this.pendulum.theta);
            }
            this.pendulum.update(this.tau);
        }

        draw() {
            const ctx = this.ctx;
            const canvas = this.canvas;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Calculate positions
            const centerX = canvas.width / 2;
            const centerY = canvas.height * 1/2;
            const platformX = centerX - this.platformLength/2;
            const platformY = centerY - this.platformHeight/2;
            const pendulumBaseX = platformX + this.platformLength / 2;
            const pendulumBaseY = platformY;
            const thetaRadians = this.pendulum.theta;
            const thetaDegrees = this.pendulum.theta * 180 / Math.PI;
    
            // Draw text
            ctx.font = "24px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(`Angle: ${thetaDegrees.toFixed(2)}°`, 20, 40);
            ctx.fillText(`Torque: ${this.tau?.toFixed(2) || 0}`, 20, 80);
    
            // Draw platform
            ctx.fillStyle = "#333";
            ctx.fillRect(
                platformX,
                platformY,
                this.platformLength,
                this.platformHeight
            );
    
            // Draw pendulum
            ctx.save();
            ctx.translate(pendulumBaseX, pendulumBaseY);
            ctx.rotate(thetaRadians);
            
            ctx.fillStyle = "#666";
            ctx.fillRect(
                -this.pendulumWidth/2,
                -this.pendulumLength + this.platformHeight/2,
                this.pendulumWidth,
                this.pendulumLength
            );
            
            ctx.restore();
    
            // Draw pendulum bob
            const bobX = pendulumBaseX + this.pendulumLength * Math.sin(thetaRadians);
            const bobY = pendulumBaseY - this.pendulumLength * Math.cos(thetaRadians);
            
            ctx.fillStyle = "#d00";
            ctx.beginPath();
            ctx.arc(bobX, bobY, 30, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    new SimulationUI();