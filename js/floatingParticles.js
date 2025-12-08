class FloatingParticles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        const count = 80; // больше частиц — как облако пыли
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.7, // маленькие, как пылинки
                color: 'rgba(0, 255, 255, 0.9)',  // только бирюзовые
                vx: 0,
                vy: 0,
                forceX: 0,
                forceY: 0,
                maxSpeed: 0.6,
                attraction: 0.03,    // слабое притяжение к курсору
                jitter: 0.02        // хаотичность (броуновское движение)
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            // === 1. Хаотичное движение (броуновское) ===
            p.forceX += (Math.random() - 0.5) * p.jitter * 2;
            p.forceY += (Math.random() - 0.5) * p.jitter * 2;

            // Ограничиваем силу
            p.forceX *= 0.9;
            p.forceY *= 0.9;

            // === 2. Притяжение к курсору ===
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const targetDist = 150; // радиус притяжения

            if (dist < targetDist && dist > 10) {
                // Тянем к курсору
                p.vx += (dx / dist) * p.attraction;
                p.vy += (dy / dist) * p.attraction;
            } else if (dist >= targetDist) {
                // Лёгкое возвращение, если ушли далеко
                if (Math.random() > 0.98) {
                    p.vx += (dx / (dist || 1)) * 0.01;
                    p.vy += (dy / (dist || 1)) * 0.01;
                }
            }

            // === 3. Обновляем скорость и позицию ===
            p.vx += p.forceX;
            p.vy += p.forceY;

            // Ограничиваем скорость
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > p.maxSpeed) {
                p.vx = (p.vx / speed) * p.maxSpeed;
                p.vy = (p.vy / speed) * p.maxSpeed;
            }

            p.vx *= 0.95; // трение
            p.vy *= 0.95;

            p.x += p.vx;
            p.y += p.vy;

            // === 4. Обход краёв экрана ===
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // === 5. Рисуем частицу с неоновым свечением ===
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