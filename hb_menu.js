
       console.log('load script')
       
       // --- Логика для гамбургер-меню ---
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const mobileNav = document.querySelector('.mobile-nav');
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('is-active');
            mobileNav.classList.toggle('is-active');
        });
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('is-active');
                mobileNav.classList.remove('is-active');
            });
        });

        // --- Логика для анимации при прокрутке ---
        const animatedSections = document.querySelectorAll('.animated-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedSections.forEach(section => { observer.observe(section); });

        // --- Эффект для шапки при скролле ---
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 50 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
        });

        // --- СКРИПТ АНИМАЦИИ "ИГРА ЖИЗНЬ" ---
        const canvas = document.getElementById('gameOfLifeCanvas');
        const ctx = canvas.getContext('2d');
        
        const cellSize = 12;
        const aliveColor = 'rgba(0, 130, 255, 0.7)';
        const deadColor = 'rgba(13, 17, 23, 1)';

        let grid;
        let cols, rows;
        let animationFrameId;

        function setup() {
            if (window.innerWidth <= 768) {
        // Если мобильное устройство, останавливаем анимацию и очищаем canvas
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            const heroSection = document.querySelector('.hero');
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            cols = Math.ceil(canvas.width / cellSize);
            rows = Math.ceil(canvas.height / cellSize);
            grid = createGrid(cols, rows);
            animate();
        }

        function createGrid(cols, rows) {
            let arr = new Array(cols);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = new Array(rows);
                for (let j = 0; j < arr[i].length; j++) {
                    // Инициализируем случайным состоянием (живая/мертвая клетка)
                    arr[i][j] = Math.random() > 0.8; // 20% клеток будут живыми вначале
                }
            }
            return arr;
        }

        function draw() {
            ctx.fillStyle = deadColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = aliveColor;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (grid[i][j]) {
                        ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
                    }
                }
            }
        }

        function update() {
            let nextGrid = createGrid(cols, rows);
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const state = grid[i][j];
                    const neighbors = countNeighbors(grid, i, j);

                    if (state && (neighbors < 2 || neighbors > 3)) {
                        nextGrid[i][j] = false; // Умирает от одиночества или перенаселения
                    } else if (!state && neighbors === 3) {
                        nextGrid[i][j] = true; // Оживает
                    } else {
                        nextGrid[i][j] = state; // Остается в том же состоянии
                    }
                }
            }
            grid = nextGrid;
        }

        function countNeighbors(grid, x, y) {
            let sum = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue;
                    const col = (x + i + cols) % cols;
                    const row = (y + j + rows) % rows;
                    sum += grid[col][row];
                }
            }
            return sum;
        }

        let lastTime = 0;
        const fps = 10; // 10 кадров в секунду для плавной, но не слишком быстрой анимации
        const interval = 1000 / fps;

        function animate(timestamp) {
            if (timestamp - lastTime > interval) {
                lastTime = timestamp;
                update();
                draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        // Запускаем при загрузке и при изменении размера окна
        window.addEventListener('load', setup);
        window.addEventListener('resize', setup);

