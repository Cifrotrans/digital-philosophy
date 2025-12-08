class FloatingParticles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.trail = []; // история позиций для следа
        this.maxTrail = 20; // длина следа
        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        const count = 70;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.7,
                color: 'rgba(0, 255, 255, 0.9)',
                vx: 0,
                vy: 0,
                forceX: 0,
                forceY: 0,
                maxSpeed: 0.6,
                attraction: 0.03,
                jitter: 0.02,
                history: [] // каждая частица хранит свои последние позиции
            });
        }
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        // Полупрозрачный слой — создаёт эффект затухания следа
   
        this.particles.forEach(p => {
            // === 1. Хаотичное движение (броуновское) ===
            p.forceX += (Math.random() - 0.5) * p.jitter * 2;
            p.forceY += (Math.random() - 0.5) * p.jitter * 2;
            p.forceX *= 0.9;
            p.forceY *= 0.9;

            // === 2. Притяжение к курсору ===
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const targetDist = 150;

            if (dist < targetDist && dist > 10) {
                p.vx += (dx / dist) * p.attraction;
                p.vy += (dy / dist) * p.attraction;
            } else if (dist >= targetDist && Math.random() > 0.98) {
                p.vx += (dx / (dist || 1)) * 0.01;
                p.vy += (dy / (dist || 1)) * 0.01;
            }

            // === 3. Обновляем скорость и позицию ===
            p.vx += p.forceX;
            p.vy += p.forceY;

            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > p.maxSpeed) {
                p.vx = (p.vx / speed) * p.maxSpeed;
                p.vy = (p.vy / speed) * p.maxSpeed;
            }

            p.vx *= 0.95;
            p.vy *= 0.95;

            p.x += p.vx;
            p.y += p.vy;

            // === 4. Обход краёв экрана ===
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // === 5. История позиций (trail) ===
            p.history.push({ x: p.x, y: p.y });
            if (p.history.length > this.maxTrail) {
                p.history.shift();
            }

            // === 6. Рисуем след ===
            if (p.history.length > 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(p.history[0].x, p.history[0].y);

                for (let i = 1; i < p.history.length; i++) {
                    const point = p.history[i];
                    const radius = p.radius * (i / p.history.length); // тоньше к концу
                    this.ctx.lineTo(point.x, point.y);
                }

                this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
                this.ctx.lineWidth = p.radius * 1.2;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.stroke();

                // Добавляем свечение
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = 'rgba(0, 255, 255, 0.3)';
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            }

            // === 7. Рисуем саму частицу поверх следа ===
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(0, 255, 255, 0.7)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        requestAnimationFrame(() => this.animate());
    }
}