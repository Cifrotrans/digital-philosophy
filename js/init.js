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
        particlesCanvas.style.mixBlendMode = 'screen';
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

    // === ЛОГОТИП GigaCode ВМЕСТО BETA — ПРАВЫЙ НИЖНИЙ УГОЛ ===
    const gigacodeBadge = document.createElement('a');
    gigacodeBadge.href = 'https://github.com/Cifrotrans/digital-philosophy'; // 
    gigacodeBadge.target = '_blank';
    gigacodeBadge.rel = 'noopener noreferrer';
    gigacodeBadge.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        pointer-events: auto;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        transition: transform 0.3s ease;
    `;
    gigacodeBadge.innerHTML = `
        <div style="
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(0, 255, 255, 0.5);
            border-radius: 50%;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
            animation: pulse 2s infinite;
            backdrop-filter: blur(6px);
        ">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#00FFFF"/>
                <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="#00FFFF" stroke-width="2" fill="none"/>
            </svg>
        </div>
        <span style="
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.7rem;
            margin-top: 4px;
            text-align: center;
            width: 50px;
        ">by GigaCode</span>
    `;
    document.body.appendChild(gigacodeBadge);

    // Анимация пульсации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(0, 255, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
        }
        ${gigacodeBadge.style.cssText} &:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    // === "POWERED BY AI" В ШАПКУ ===
    const poweredByAI = document.createElement('div');
    poweredByAI.innerHTML = `
        <div style="
            position: absolute;
            top: 0;
            right: 0;
            background: rgba(255, 42, 109, 0.1);
            border-left: 1px solid rgba(255, 42, 109, 0.4);
            border-bottom: 1px solid rgba(255, 42, 109, 0.4);
            color: #ff2a6d;
            font-size: 0.75rem;
            font-weight: 500;
            padding: 0.25rem 0.6rem;
            z-index: 999;
            border-bottom-left-radius: 8px;
            backdrop-filter: blur(4px);
            pointer-events: none;
            white-space: nowrap;
        ">
            Powered by AI
        </div>
    `;
    const header = document.querySelector('header');
    if (header) {
        header.style.position = 'relative';
        header.appendChild(poweredByAI);
    }

    // === ПОДПИСЬ В ФУТЕР — КЛИКАБЕЛЬНАЯ ===
    const footer = document.querySelector('footer');
    if (footer) {
        const aiCredit = document.createElement('p');
        aiCredit.innerHTML = `
            <small style="
                display: block;
                text-align: center;
                margin-top: 1rem;
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.85rem;
                line-height: 1.5;
                max-width: 800px;
                margin-left: auto;
                margin-right: auto;
                padding: 0 1rem;
            ">
                Сайт разработан с использованием 
                <a href="https://github.com/Cifrotrans/digital-philosophy" 
                  
                   style="color: #00ffff; text-decoration: underline; font-weight: 500;">
                    GigaChat и Perplexity AI
                </a> 
                на основе курса, прочитанного в 
                <strong>НИУ ВШЭ</strong> в 2025–2026 гг. и семинаров цифровой философии в СПбГУ
            </small>
        `;
        footer.appendChild(aiCredit);
    }
});
