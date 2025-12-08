class GameOfLife {
    constructor(canvas, cellSize = 20) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = cellSize;
        this.resizeCanvas();

        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);

        this.grid = this.createGrid();
        this.nextGrid = this.createGrid();
        this.randomize(0.15);

        this.animationId = null;
        this.lastUpdate = Date.now();
        this.updateInterval = 150;
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createGrid() {
        return Array(this.rows).fill(null).map(() =>
            Array(this.cols).fill(null).map(() => ({ alive: false, age: 0 }))
        );
    }

    randomize(density = 0.2) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col].alive = Math.random() < density;
                this.grid[row][col].age = this.grid[row][col].alive ? 1 : 0;
            }
        }
    }

    countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = (row + i + this.rows) % this.rows;
                const newCol = (col + j + this.cols) % this.cols;
                if (this.grid[newRow][newCol].alive) count++;
            }
        }
        return count;
    }

    update() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const neighbors = this.countNeighbors(row, col);
                const cell = this.grid[row][col];

                if (cell.alive) {
                    this.nextGrid[row][col].alive = neighbors === 2 || neighbors === 3;
                    this.nextGrid[row][col].age = this.nextGrid[row][col].alive ? cell.age + 1 : 0;
                } else {
                    this.nextGrid[row][col].alive = neighbors === 3;
                    this.nextGrid[row][col].age = this.nextGrid[row][col].alive ? 1 : 0;
                }
            }
        }
        [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
    }

    getColor(age) {
        if (age === 0) return 'rgba(0, 0, 0, 0)';
        const maxAge = 50;
        const normalizedAge = Math.min(age / maxAge, 1);

        if (normalizedAge < 0.33) {
            const t = normalizedAge / 0.33;
            return `rgba(0, ${Math.floor(100 + t * 155)}, 255, ${0.6 + t * 0.4})`;
        } else if (normalizedAge < 0.66) {
            const t = (normalizedAge - 0.33) / 0.33;
            return `rgba(${Math.floor(t * 57)}, ${Math.floor(255 - t * 105)}, ${Math.floor(255 - t * 141)}, ${0.8 + t * 0.2})`;
        } else {
            const t = (normalizedAge - 0.66) / 0.34;
            return `rgba(${Math.floor(57 + t * 198)}, ${Math.floor(150 - t * 150)}, ${Math.floor(114 + t * 141)}, 1)`;
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                if (cell.alive) {
                    const x = col * this.cellSize;
                    const y = row * this.cellSize;
                    const color = this.getColor(cell.age);

                    this.ctx.shadowBlur = 15;
                    this.ctx.shadowColor = color;
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
                    this.ctx.shadowBlur = 0;
                }
            }
        }
    }

    animate() {
        const now = Date.now();
        if (now - this.lastUpdate > this.updateInterval) {
            this.update();
            this.lastUpdate = now;
        }
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (!this.animationId) this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}