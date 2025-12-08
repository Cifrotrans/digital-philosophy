// === УВЕРЕННЫЙ ЛОАДЕР С ПЕРЕХОДОМ НА simple.html ПО "x" ===

document.addEventListener('DOMContentLoaded', () => {
    // Находим лоадер
    const loader = document.getElementById('terminal-loader');
    if (!loader) return; // если лоадера нет — выходим

    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const loaderText = document.getElementById('loader-text');

    // Все ресурсы
    const images = document.querySelectorAll('img');
    const scripts = document.querySelectorAll('script[src]:not([type="application/json"])');
    const styles = document.querySelectorAll('link[rel="stylesheet"]');

    const total = images.length + scripts.length + styles.length;
    let loaded = 0;

    // Если нет ресурсов — сразу скрываем лоадер
    if (total === 0) {
        setTimeout(() => {
            loader.classList.remove('active');
        }, 600);
        return;
    }

    // Сообщения
    const messages = [
        "Инициализация AI-ядра...",
        "Загрузка модуля философии...",
        "Подключение к цифровому сознанию...",
        "Синхронизация с будущим...",
        "Загрузка критического мышления v2.0...",
        "Оптимизация контекста..."
    ];

    function randomMessage() {
        if (Math.random() > 0.6) {
            loaderText.textContent = messages[Math.floor(Math.random() * messages.length)];
        }
    }

    function updateProgress() {
        loaded++;
        const percent = Math.round((loaded / total) * 100);
        progressText.textContent = `Загрузка: ${percent}%`;
        progressFill.style.width = `${percent}%`;

        if (loaded % 2 === 0) randomMessage();
    }

    // Слушаем загрузку ресурсов
    images.forEach(img => {
        if (img.complete) updateProgress();
        else { img.onload = img.onerror = updateProgress; }
    });

    scripts.forEach(script => {
        if (script.dataset.loaded) updateProgress();
        else { script.onload = script.onerror = updateProgress; }
    });

    styles.forEach(link => {
        if (link.sheet) updateProgress();
        else { link.onload = link.onerror = updateProgress; }
    });

    // === КЛЮЧЕВАЯ ЧАСТЬ: НАЖАТИЕ "x" → ПЕРЕХОД НА simple.html ===
    const handleKey = (e) => {
        if (e.key === 'x' || e.key === 'X') {
            // Убедимся, что лоадер всё ещё активен
            if (loader.classList.contains('active')) {
                console.log('Нажато X — редирект на simple.html');
                loaderText.textContent = 'Переход на лёгкую версию...';
                progressText.textContent = 'Редирект...';

                // Убираем лоадер и переходим
                setTimeout(() => {
                    window.location.href = 'simple.html';
                }, 500);
            }
        }
    };

    // Добавляем слушатель
    document.addEventListener('keydown', handleKey);

    // === ТАЙМАУТ: если тяжело грузится → редирект через 5 сек ===
    setTimeout(() => {
        if (loader.classList.contains('active')) {
            loaderText.style.color = '#ff2a6d';
            loaderText.textContent = 'Извините, переводим на лёгкую версию...';
            setTimeout(() => {
                window.location.href = 'simple.html';
            }, 800);
        }
    }, 5000);

    // === Завершение загрузки → скрываем лоадер ===
    window.addEventListener('load', () => {
        if (loaded < total) {
            loaded = total;
            progressText.textContent = 'Загрузка: 100%';
            progressFill.style.width = '100%';
        }

        loaderText.textContent = 'Готово. Добро пожаловать.';
        setTimeout(() => {
            loader.classList.remove('active');
        }, 600);
    });
});