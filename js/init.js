document.addEventListener('DOMContentLoaded', () => {
    // === Game of Life ===
    const heroCanvas = document.getElementById('gameOfLifeCanvas');
    if (heroCanvas) {
        const gameOfLife = new GameOfLife(heroCanvas, 20);
        gameOfLife.start();

        // === Частицы, следующие за курсором ===
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
            floatingParticles.resize();
            gameOfLife.stop();
            gameOfLife.resizeCanvas();
            gameOfLife.cols = Math.floor(gameOfLife.canvas.width / gameOfLife.cellSize);
            gameOfLife.rows = Math.floor(gameOfLife.canvas.height / gameOfLife.cellSize);
            gameOfLife.grid = gameOfLife.createGrid();
            gameOfLife.nextGrid = gameOfLife.createGrid();
            gameOfLife.randomize(0.15);
            gameOfLife.start();
        });
    }

    // === Анимация появления ===
    new ScrollAnimation();

    // === Бургер и меню ===
    const burgerCanvas = document.getElementById('burgerCanvas');
    const closeCanvas = document.querySelector('.close-canvas');
    const burgerButton = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('closeMobileMenu');

    let burgerAnim = null;
    let closeIcon = null;

    if (burgerCanvas) burgerAnim = new BurgerGameOfLife(burgerCanvas);
    if (closeCanvas) closeIcon = new ClosePixelIcon(closeCanvas);

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
});