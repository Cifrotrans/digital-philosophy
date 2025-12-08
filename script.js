// // ============================================
// // GAME OF LIFE - КОНФИГУРАЦИЯ (HERO)
// // ============================================

// class GameOfLife {
//     constructor(canvas, cellSize = 20) {
//         this.canvas = canvas;
//         this.ctx = canvas.getContext('2d');
//         this.cellSize = cellSize;
//         this.resizeCanvas();

//         this.cols = Math.floor(this.canvas.width / this.cellSize);
//         this.rows = Math.floor(this.canvas.height / this.cellSize);

//         this.grid = this.createGrid();
//         this.nextGrid = this.createGrid();
//         this.randomize(0.15);

//         this.animationId = null;
//         this.lastUpdate = Date.now();
//         this.updateInterval = 150;
//     }

//     resizeCanvas() {
//         this.canvas.width = window.innerWidth;
//         this.canvas.height = window.innerHeight;
//     }

//     createGrid() {
//         return Array(this.rows).fill(null).map(() =>
//             Array(this.cols).fill(null).map(() => ({ alive: false, age: 0 }))
//         );
//     }

//     randomize(density = 0.2) {
//         for (let row = 0; row < this.rows; row++) {
//             for (let col = 0; col < this.cols; col++) {
//                 this.grid[row][col].alive = Math.random() < density;
//                 this.grid[row][col].age = this.grid[row][col].alive ? 1 : 0;
//             }
//         }
//     }

//     countNeighbors(row, col) {
//         let count = 0;
//         for (let i = -1; i <= 1; i++) {
//             for (let j = -1; j <= 1; j++) {
//                 if (i === 0 && j === 0) continue;
//                 const newRow = (row + i + this.rows) % this.rows;
//                 const newCol = (col + j + this.cols) % this.cols;
//                 if (this.grid[newRow][newCol].alive) count++;
//             }
//         }
//         return count;
//     }

//     update() {
//         for (let row = 0; row < this.rows; row++) {
//             for (let col = 0; col < this.cols; col++) {
//                 const neighbors = this.countNeighbors(row, col);
//                 const cell = this.grid[row][col];

//                 if (cell.alive) {
//                     this.nextGrid[row][col].alive = neighbors === 2 || neighbors === 3;
//                     this.nextGrid[row][col].age = this.nextGrid[row][col].alive ? cell.age + 1 : 0;
//                 } else {
//                     this.nextGrid[row][col].alive = neighbors === 3;
//                     this.nextGrid[row][col].age = this.nextGrid[row][col].alive ? 1 : 0;
//                 }
//             }
//         }
//         [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
//     }

//     getColor(age) {
//         if (age === 0) return 'rgba(0, 0, 0, 0)';
//         const maxAge = 50;
//         const normalizedAge = Math.min(age / maxAge, 1);

//         if (normalizedAge < 0.33) {
//             const t = normalizedAge / 0.33;
//             return `rgba(0, ${Math.floor(100 + t * 155)}, 255, ${0.6 + t * 0.4})`;
//         } else if (normalizedAge < 0.66) {
//             const t = (normalizedAge - 0.33) / 0.33;
//             return `rgba(${Math.floor(t * 57)}, ${Math.floor(255 - t * 105)}, ${Math.floor(255 - t * 141)}, ${0.8 + t * 0.2})`;
//         } else {
//             const t = (normalizedAge - 0.66) / 0.34;
//             return `rgba(${Math.floor(57 + t * 198)}, ${Math.floor(150 - t * 150)}, ${Math.floor(114 + t * 141)}, 1)`;
//         }
//     }

//     draw() {
//         this.ctx.fillStyle = '#000';
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//         for (let row = 0; row < this.rows; row++) {
//             for (let col = 0; col < this.cols; col++) {
//                 const cell = this.grid[row][col];
//                 if (cell.alive) {
//                     const x = col * this.cellSize;
//                     const y = row * this.cellSize;
//                     const color = this.getColor(cell.age);

//                     this.ctx.shadowBlur = 15;
//                     this.ctx.shadowColor = color;
//                     this.ctx.fillStyle = color;
//                     this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
//                     this.ctx.shadowBlur = 0;
//                 }
//             }
//         }
//     }

//     animate() {
//         const now = Date.now();
//         if (now - this.lastUpdate > this.updateInterval) {
//             this.update();
//             this.lastUpdate = now;
//         }
//         this.draw();
//         this.animationId = requestAnimationFrame(() => this.animate());
//     }

//     start() {
//         if (!this.animationId) this.animate();
//     }

//     stop() {
//         if (this.animationId) {
//             cancelAnimationFrame(this.animationId);
//             this.animationId = null;
//         }
//     }
// }

// // ============================================
// // BURGER MENU — GAME OF LIFE АНИМАЦИЯ
// // ============================================

// class BurgerGameOfLife {
//     constructor(canvas, size = 6) {
//         this.canvas = canvas;
//         this.ctx = canvas.getContext('2d');
//         this.size = size;
//         this.cellSize = Math.floor(40 / this.size);
//         this.grid = this.createGrid();
//         this.isOpen = false;
//         this.animationId = null;
//         this.frame = 0;
//         this.drawBurger();
//     }

//     createGrid() {
//         return Array(this.size).fill(null).map(() => Array(this.size).fill(false));
//     }

//     setBurgerPattern() {
//         this.grid = this.createGrid();
//         const mid = Math.floor(this.size / 2);
//         for (let col = 1; col < this.size - 1; col++) {
//             this.grid[1][col] = true;
//             this.grid[mid][col] = true;
//             this.grid[this.size - 2][col] = true;
//         }
//     }

//     setRandomPattern() {
//         for (let row = 0; row < this.size; row++) {
//             for (let col = 0; col < this.size; col++) {
//                 this.grid[row][col] = Math.random() > 0.5;
//             }
//         }
//     }

//     countNeighbors(row, col) {
//         let count = 0;
//         for (let i = -1; i <= 1; i++) {
//             for (let j = -1; j <= 1; j++) {
//                 if (i === 0 && j === 0) continue;
//                 const newRow = row + i;
//                 const newCol = col + j;
//                 if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size && this.grid[newRow][newCol]) {
//                     count++;
//                 }
//             }
//         }
//         return count;
//     }

//     update() {
//         const nextGrid = this.createGrid();
//         for (let row = 0; row < this.size; row++) {
//             for (let col = 0; col < this.size; col++) {
//                 const neighbors = this.countNeighbors(row, col);
//                 nextGrid[row][col] = this.grid[row][col] ? (neighbors === 2 || neighbors === 3) : (neighbors === 3);
//             }
//         }
//         this.grid = nextGrid;
//     }

//     draw() {
//         this.ctx.clearRect(0, 0, 40, 40);
//         for (let row = 0; row < this.size; row++) {
//             for (let col = 0; col < this.size; col++) {
//                 if (this.grid[row][col]) {
//                     const x = col * this.cellSize + 2;
//                     const y = row * this.cellSize + 2;
//                     this.ctx.fillStyle = '#fff';
//                     this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
//                 }
//             }
//         }
//     }

//     drawBurger() {
//         this.setBurgerPattern();
//         this.draw();
//     }

//     toggle() {
//         this.isOpen = !this.isOpen;
//         if (this.isOpen) {
//             this.startAnimation();
//         } else {
//             this.stopAnimation();
//             setTimeout(() => this.drawBurger(), 300);
//         }
//     }

//     startAnimation() {
//         this.setRandomPattern();
//         this.frame = 0;
//         const animate = () => {
//             if (this.frame < 10 && this.isOpen) {
//                 this.update();
//                 this.draw();
//                 this.frame++;
//                 this.animationId = setTimeout(animate, 100);
//             }
//         };
//         animate();
//     }

//     stopAnimation() {
//         if (this.animationId) {
//             clearTimeout(this.animationId);
//             this.animationId = null;
//         }
//     }
// }

// // ============================================
// // CLOSE ICON — КРЕСТИК ИЗ КВАДРАТИКОВ С АНИМАЦИЕЙ
// // ============================================

// class ClosePixelIcon {
//     constructor(canvas, size = 6) {
//         this.canvas = canvas;
//         this.ctx = canvas.getContext('2d');
//         this.size = size;
//         this.cellSize = Math.floor(40 / this.size);
//         this.grid = this.createGrid();
//         this.targetGrid = this.createGrid();
//         this.animationId = null;
//         this.frame = 0;
//         this.maxFrames = 12;

//         this.setTargetCross();
//         this.clear();
//     }

//     createGrid() {
//         return Array(this.size).fill(null).map(() => Array(this.size).fill(false));
//     }

//     setTargetCross() {
//         const mid = Math.floor(this.size / 2);
//         for (let i = 1; i < this.size - 1; i++) {
//             this.targetGrid[mid][i] = true;
//             this.targetGrid[i][mid] = true;
//         }
//     }

//     getPixelList() {
//         const pixels = [];
//         const mid = Math.floor(this.size / 2);
//         for (let i = 1; i < this.size - 1; i++) {
//             if (i !== mid) pixels.push([mid, i]);
//             pixels.push([i, mid]);
//         }
//         return pixels;
//     }

//     shuffleArray(array) {
//         for (let i = array.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [array[i], array[j]] = [array[j], array[i]];
//         }
//     }

//     drawFrame(pixels, shownCount) {
//         this.grid = this.createGrid();
//         for (let i = 0; i < shownCount && i < pixels.length; i++) {
//             const [row, col] = pixels[i];
//             this.grid[row][col] = true;
//         }
//         this.draw();
//     }

//     draw() {
//         this.ctx.clearRect(0, 0, 40, 40);
//         for (let row = 0; row < this.size; row++) {
//             for (let col = 0; col < this.size; col++) {
//                 if (this.grid[row][col]) {
//                     const x = col * this.cellSize + 2;
//                     const y = row * this.cellSize + 2;
//                     this.ctx.fillStyle = '#fff';
//                     this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
//                 }
//             }
//         }
//     }

//     animateIn(callback) {
//         const pixels = this.getPixelList();
//         this.shuffleArray(pixels);
//         const totalPixels = pixels.length;
//         this.frame = 0;

//         const animate = () => {
//             const shown = Math.floor((this.frame / this.maxFrames) * totalPixels);
//             this.drawFrame(pixels, shown);
//             this.frame++;
//             if (this.frame <= this.maxFrames) {
//                 this.animationId = setTimeout(animate, 80);
//             } else {
//                 this.drawFinal();
//                 if (callback && typeof callback === 'function') callback();
//             }
//         };
//         animate();
//     }

//     animateOut(callback) {
//         const pixels = this.getPixelList();
//         this.shuffleArray(pixels);
//         const totalPixels = pixels.length;
//         this.frame = 0;

//         const animate = () => {
//             const hidden = Math.floor((this.frame / this.maxFrames) * totalPixels);
//             const shown = totalPixels - hidden;
//             this.drawFrame(pixels, shown);
//             this.frame++;
//             if (this.frame <= this.maxFrames) {
//                 this.animationId = setTimeout(animate, 60);
//             } else {
//                 this.clear();
//                 if (callback && typeof callback === 'function') callback();
//             }
//         };
//         animate();
//     }

//     drawFinal() {
//         this.grid = this.targetGrid;
//         this.draw();
//     }

//     clear() {
//         this.ctx.clearRect(0, 0, 40, 40);
//     }
// }

// // ============================================
// // ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ
// // ============================================

// document.addEventListener('DOMContentLoaded', () => {
//     // Инициализация Game of Life
//     const heroCanvas = document.getElementById('gameOfLifeCanvas');
//     if (heroCanvas) {
//         const gameOfLife = new GameOfLife(heroCanvas, 20);
//         gameOfLife.start();

//         window.addEventListener('resize', () => {
//             gameOfLife.stop();
//             gameOfLife.resizeCanvas();
//             gameOfLife.cols = Math.floor(gameOfLife.canvas.width / gameOfLife.cellSize);
//             gameOfLife.rows = Math.floor(gameOfLife.canvas.height / gameOfLife.cellSize);
//             gameOfLife.grid = gameOfLife.createGrid();
//             gameOfLife.nextGrid = gameOfLife.createGrid();
//             gameOfLife.randomize(0.15);
//             gameOfLife.start();
//         });
//     }

//     // Элементы
//     const burgerCanvas = document.getElementById('burgerCanvas');
//     const closeCanvas = document.querySelector('.close-canvas');
//     const burgerButton = document.getElementById('burgerMenu');
//     const mobileMenu = document.getElementById('mobileMenu');
//     const closeBtn = document.getElementById('closeMobileMenu');

//     if (!burgerButton || !mobileMenu) {
//         console.warn('Элементы меню не найдены.');
//         return;
//     }

//     let burgerAnim = null;
//     let closeIcon = null;

//     if (burgerCanvas) {
//         burgerAnim = new BurgerGameOfLife(burgerCanvas);
//     }

//     if (closeCanvas) {
//         closeIcon = new ClosePixelIcon(closeCanvas);
//     }

//     // Закрытие меню
//     const safeCloseMenu = () => {
//         if (closeIcon && mobileMenu.classList.contains('open')) {
//             closeIcon.animateOut(() => {
//                 if (burgerAnim) burgerAnim.toggle();
//                 mobileMenu.classList.remove('open');
//                 document.body.style.overflow = '';
//             });
//         } else {
//             if (burgerAnim) burgerAnim.toggle();
//             mobileMenu.classList.remove('open');
//             document.body.style.overflow = '';
//         }
//     };

//     // Открытие/закрытие по бургеру
//     burgerButton.addEventListener('click', (e) => {
//         e.stopPropagation();
//         if (!mobileMenu.classList.contains('open')) {
//             mobileMenu.classList.add('open');
//             document.body.style.overflow = 'hidden';
//             if (burgerAnim) burgerAnim.toggle();
//             if (closeIcon) closeIcon.animateIn();
//         } else {
//             safeCloseMenu();
//         }
//     });

//     // Закрытие по крестику
//     closeBtn?.addEventListener('click', (e) => {
//         e.stopPropagation();
//         if (mobileMenu.classList.contains('open')) {
//             safeCloseMenu();
//         }
//     });

//     // Закрытие по ссылке в меню
//     mobileMenu.querySelectorAll('a').forEach(link => {
//         link.addEventListener('click', (e) => {
//             const href = link.getAttribute('href');

//             // Если ссылка ведёт на другую страницу с якорем — ничего не блокируем
//             if (href.includes('.html#') || (href.includes('.htm#'))) {
//                 return;
//             }

//             // Если ссылка — якорь на этой странице
//             if (href && href.startsWith('#')) {
//                 e.preventDefault();
//                 const target = document.querySelector(href);
//                 if (target) {
//                     safeCloseMenu();
//                     setTimeout(() => {
//                         target.scrollIntoView({ behavior: 'smooth' });
//                     }, 400);
//                 }
//                 return;
//             }

//             // Внешняя/внутренняя страница — закрываем меню, но не блокируем переход
//             if (href && !href.startsWith('#')) {
//                 safeCloseMenu();
//             }
//         });
//     });

//     // Закрытие по клику вне
//     document.addEventListener('click', (e) => {
//         if (
//             mobileMenu.classList.contains('open') &&
//             !mobileMenu.contains(e.target) &&
//             !burgerButton.contains(e.target)
//         ) {
//             safeCloseMenu();
//         }
//     });

//     // Закрытие при ресайзе
//     window.addEventListener('resize', () => {
//         if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
//             safeCloseMenu();
//         }
//     });

//     // Плавная прокрутка по якорям (на этой странице)
//     document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
//         if (anchor.getAttribute('href').includes('.html#')) return;

//         anchor.addEventListener('click', function (e) {
//             const href = this.getAttribute('href');
//             if (!href.startsWith('#') || href === '#') return;

//             e.preventDefault();
//             const target = document.querySelector(href);
//             if (target) {
//                 target.scrollIntoView({ behavior: 'smooth', block: 'start' });
//             }
//         });
//     });
// });

// // === ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРЯМ ===
// document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         const targetId = this.getAttribute('href').substring(1);
//         const target = document.getElementById(targetId);
//         if (target) {
//             e.preventDefault();
//             target.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start'
//             });
//         }
//     });
// });

// document.querySelectorAll('.dropdown').forEach(dropdown => {
//     let timeout;

//     dropdown.addEventListener('mouseenter', () => {
//         const content = dropdown.querySelector('.dropdown-content');
//         if (content) {
//             clearTimeout(timeout);
//             content.style.opacity = '1';
//             content.style.visibility = 'visible';
//             content.style.transform = 'translateY(0)';
//         }
//     });

//     dropdown.addEventListener('mouseleave', () => {
//         const content = dropdown.querySelector('.dropdown-content');
//         if (content) {
//             timeout = setTimeout(() => {
//                 content.style.opacity = '0';
//                 content.style.visibility = 'hidden';
//                 content.style.transform = 'translateY(-8px)';
//             }, 200); // задержка 200мс — успеете навести
//         }
//     });

//     // Защита: если мышь вошла в меню — отменить скрытие
//     const content = dropdown.querySelector('.dropdown-content');
//     if (content) {
//         content.addEventListener('mouseenter', () => {
//             clearTimeout(timeout);
//         });

//         content.addEventListener('mouseleave', () => {
//             dropdown.querySelector('.dropdown-content').style.opacity = '0';
//             dropdown.querySelector('.dropdown-content').style.visibility = 'hidden';
//             dropdown.querySelector('.dropdown-content').style.transform = 'translateY(-8px)';
//         });
//     }
// });


// ============================================
// GAME OF LIFE - КОНФИГУРАЦИЯ (HERO)
// ============================================

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

// ============================================
// ПЛАВАЮЩИЕ ЧАСТИЦЫ В HERO
// ============================================

class FloatingParticles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.init();
        this.animate();
    }

    init() {
        const count = 50;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? 'rgba(0, 255, 255, 0.6)' : 'rgba(255, 42, 109, 0.6)',
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                alpha: Math.random() * 0.5 + 0.5
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color.replace(')', `,${p.alpha})`);
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// BURGER MENU — GAME OF LIFE АНИМАЦИЯ
// ============================================

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

// ============================================
// CLOSE ICON — КРЕСТИК ИЗ КВАДРАТИКОВ
// ============================================

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

    animateIn(callback) {
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
                if (callback && typeof callback === 'function') callback();
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
                if (callback && typeof callback === 'function') callback();
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

// ============================================
// ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация Game of Life
    const heroCanvas = document.getElementById('gameOfLifeCanvas');
    if (heroCanvas) {
        const gameOfLife = new GameOfLife(heroCanvas, 20);
        gameOfLife.start();

        // Плавающие частицы
        const particlesCanvas = document.createElement('canvas');
        particlesCanvas.id = 'particlesCanvas';
        particlesCanvas.style.position = 'absolute';
        particlesCanvas.style.top = '0';
        particlesCanvas.style.left = '0';
        particlesCanvas.style.zIndex = '1';
        particlesCanvas.style.pointerEvents = 'none';
        document.getElementById('hero').prepend(particlesCanvas);

        const floatingParticles = new FloatingParticles(particlesCanvas);
        floatingParticles.resize();

        window.addEventListener('resize', () => {
            gameOfLife.stop();
            gameOfLife.resizeCanvas();
            gameOfLife.cols = Math.floor(gameOfLife.canvas.width / gameOfLife.cellSize);
            gameOfLife.rows = Math.floor(gameOfLife.canvas.height / gameOfLife.cellSize);
            gameOfLife.grid = gameOfLife.createGrid();
            gameOfLife.nextGrid = gameOfLife.createGrid();
            gameOfLife.randomize(0.15);
            gameOfLife.start();

            floatingParticles.resize();
        });
    }

    // Элементы
    const burgerCanvas = document.getElementById('burgerCanvas');
    const closeCanvas = document.querySelector('.close-canvas');
    const burgerButton = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('closeMobileMenu');

    let burgerAnim = null;
    let closeIcon = null;

    if (burgerCanvas) {
        burgerAnim = new BurgerGameOfLife(burgerCanvas);
    }

    if (closeCanvas) {
        closeIcon = new ClosePixelIcon(closeCanvas);
    }

    const safeCloseMenu = () => {
        if (closeIcon && mobileMenu.classList.contains('open')) {
            closeIcon.animateOut(() => {
                if (burgerAnim) burgerAnim.toggle();
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        } else {
            if (burgerAnim) burgerAnim.toggle();
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    burgerButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!mobileMenu.classList.contains('open')) {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (burgerAnim) burgerAnim.toggle();
            if (closeIcon) closeIcon.animateIn();
        } else {
            safeCloseMenu();
        }
    });

    closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileMenu.classList.contains('open')) {
            safeCloseMenu();
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    safeCloseMenu();
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }, 400);
                }
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !burgerButton.contains(e.target)) {
            safeCloseMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
            safeCloseMenu();
        }
    });

    // === Плавная прокрутка по якорям ===
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // === Анимация появления при скролле ===
    const fadeInElements = document.querySelectorAll(
        '.section h2, .philosophy-card, .benefit-card, .stat, .cta-section, .quote, #contact'
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    fadeInElements.forEach((el) => {
        el.classList.add('will-fade-in');
        observer.observe(el);
    });
});