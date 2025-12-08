class BurgerGameOfLife {
    constructor(canvas, size = 6) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.cellSize = Math.floor(40 / this.size);
        this.grid = this.createGrid();
        this.isOpen = false;
        this.animationId = null;
        this.frame = 0;
        this.drawBurger();
    }

    createGrid() {
        return Array(this.size).fill(null).map(() => Array(this.size).fill(false));
    }

    setBurgerPattern() {
        this.grid = this.createGrid();
        const mid = Math.floor(this.size / 2);
        for (let col = 1; col < this.size - 1; col++) {
            this.grid[1][col] = true;
            this.grid[mid][col] = true;
            this.grid[this.size - 2][col] = true;
        }
    }

    setRandomPattern() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                this.grid[row][col] = Math.random() > 0.5;
            }
        }
    }

    countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size && this.grid[newRow][newCol]) {
                    count++;
                }
            }
        }
        return count;
    }

    update() {
        const nextGrid = this.createGrid();
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const neighbors = this.countNeighbors(row, col);
                nextGrid[row][col] = this.grid[row][col] ? (neighbors === 2 || neighbors === 3) : (neighbors === 3);
            }
        }
        this.grid = nextGrid;
    }

    draw() {
        this.ctx.clearRect(0, 0, 40, 40);
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col]) {
                    const x = col * this.cellSize + 2;
                    const y = row * this.cellSize + 2;
                    this.ctx.fillStyle = '#fff';
                    this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
                }
            }
        }
    }

    drawBurger() {
        this.setBurgerPattern();
        this.draw();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.startAnimation();
        } else {
            this.stopAnimation();
            setTimeout(() => this.drawBurger(), 300);
        }
    }

    startAnimation() {
        this.setRandomPattern();
        this.frame = 0;
        const animate = () => {
            if (this.frame < 10 && this.isOpen) {
                this.update();
                this.draw();
                this.frame++;
                this.animationId = setTimeout(animate, 100);
            }
        };
        animate();
    }

    stopAnimation() {
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
    }
}

class ClosePixelIcon {
    constructor(canvas, size = 6) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.cellSize = Math.floor(40 / this.size);
        this.grid = this.createGrid();
        this.targetGrid = this.createGrid();
        this.animationId = null;
        this.frame = 0;
        this.maxFrames = 12;
        this.setTargetCross();
        this.clear();
    }

    createGrid() {
        return Array(this.size).fill(null).map(() => Array(this.size).fill(false));
    }

    setTargetCross() {
        const mid = Math.floor(this.size / 2);
        for (let i = 1; i < this.size - 1; i++) {
            this.targetGrid[mid][i] = true;
            this.targetGrid[i][mid] = true;
        }
    }

    getPixelList() {
        const pixels = [];
        const mid = Math.floor(this.size / 2);
        for (let i = 1; i < this.size - 1; i++) {
            if (i !== mid) pixels.push([mid, i]);
            pixels.push([i, mid]);
        }
        return pixels;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    drawFrame(pixels, shownCount) {
        this.grid = this.createGrid();
        for (let i = 0; i < shownCount && i < pixels.length; i++) {
            const [row, col] = pixels[i];
            this.grid[row][col] = true;
        }
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, 40, 40);
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col]) {
                    const x = col * this.cellSize + 2;
                    const y = row * this.cellSize + 2;
                    this.ctx.fillStyle = '#fff';
                    this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
                }
            }
        }
    }

    animateIn() {
        const pixels = this.getPixelList();
        this.shuffleArray(pixels);
        const totalPixels = pixels.length;
        this.frame = 0;
        const animate = () => {
            const shown = Math.floor((this.frame / this.maxFrames) * totalPixels);
            this.drawFrame(pixels, shown);
            this.frame++;
            if (this.frame <= this.maxFrames) {
                this.animationId = setTimeout(animate, 80);
            } else {
                this.drawFinal();
            }
        };
        animate();
    }

    animateOut(callback) {
        const pixels = this.getPixelList();
        this.shuffleArray(pixels);
        const totalPixels = pixels.length;
        this.frame = 0;
        const animate = () => {
            const hidden = Math.floor((this.frame / this.maxFrames) * totalPixels);
            const shown = totalPixels - hidden;
            this.drawFrame(pixels, shown);
            this.frame++;
            if (this.frame <= this.maxFrames) {
                this.animationId = setTimeout(animate, 60);
            } else {
                this.clear();
                if (callback) callback();
            }
        };
        animate();
    }

    drawFinal() {
        this.grid = this.targetGrid;
        this.draw();
    }

    clear() {
        this.ctx.clearRect(0, 0, 40, 40);
    }
}