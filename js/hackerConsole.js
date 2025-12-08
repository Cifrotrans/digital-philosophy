// === ХАКЕРСКАЯ КОНСОЛЬ: Ctrl + Alt + T ===
document.addEventListener('DOMContentLoaded', () => {
    const consoleEl = document.getElementById('hacker-console');
    const output = document.getElementById('console-output');
    const input = document.getElementById('console-input');

    let commands = {};
    let isOpen = false;

    // Загружаем конфиг
    fetch('js/commands.json')
        .then(res => res.json())
        .then(data => {
            commands = data;
        })
        .catch(() => {
            commands = {
                pages: [
                    { cmd: 'main', url: 'index.html', title: 'Главная' },
                    { cmd: 'contact', url: '#contact', title: 'Контакты' }
                ],
                help: 'Команды: help, list, go [имя]'
            };
        });

    // Эффект печати
    function print(text, delay = 20) {
        return new Promise(resolve => {
            let i = 0;
            const line = document.createElement('div');
            output.appendChild(line);

            function type() {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, delay);
                } else {
                    output.scrollTop = output.scrollHeight;
                    resolve();
                }
            }
            type();
        });
    }

    // Обработка команд
    function execute(cmd) {
        const parts = cmd.trim().split(' ');
        const action = parts[0].toLowerCase();

        if (action === 'help') {
            print(commands.help);
        } else if (action === 'list') {
            print('Доступные цели:');
            commands.pages.forEach(p => {
                print(`  ${p.cmd} — ${p.title}`, 10);
            });
        } else if (action === 'go') {
            const target = parts[1];
            const page = commands.pages.find(p => p.cmd === target);
            if (page) {
                print(`Переход к: ${page.title}...`);
                setTimeout(() => {
                    if (page.url.startsWith('#')) {
                        document.querySelector(page.url).scrollIntoView({ behavior: 'smooth' });
                    } else {
                        window.location.href = page.url;
                    }
                    closeConsole();
                }, 800);
            } else {
                print('Ошибка: цель не найдена. Используйте `list`.');
            }
        } else if (action === 'exit') {
            closeConsole();
        } else {
            print('Неизвестная команда. Введите `help`.');
        }
    }

    function openConsole() {
        if (isOpen) return;
        isOpen = true;
        consoleEl.classList.remove('hidden');
        print('AI: Готов к трансформации?', 50).then(() => {
            input.focus();
        });
    }

    function closeConsole() {
        consoleEl.classList.add('hidden');
        isOpen = false;
    }
    // === ПЕРЕТАСКИВАНИЕ КОНСОЛИ ===
let isDragging = false;
let offsetX, offsetY;

// Нажатие на заголовок
document.querySelector('.console-header').addEventListener('mousedown', (e) => {
    if (!isOpen) return;
    isDragging = true;
    offsetX = e.clientX - consoleEl.getBoundingClientRect().left;
    offsetY = e.clientY - consoleEl.getBoundingClientRect().top;

    // Убираем выделение
    e.preventDefault();
});

// Движение мыши
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    // Ограничиваем движение в пределах экрана
    const maxX = window.innerWidth - consoleEl.offsetWidth;
    const maxY = window.innerHeight - consoleEl.offsetHeight;

    consoleEl.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    consoleEl.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    consoleEl.style.right = 'auto';
    consoleEl.style.bottom = 'auto';
    consoleEl.style.transform = 'none';
});

// Отпускание
document.addEventListener('mouseup', () => {
    isDragging = false;
});

    // Открытие: Ctrl + Alt + T
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            if (consoleEl.classList.contains('hidden')) {
                openConsole();
            } else {
                closeConsole();
            }
        }
    });

    // Ввод команды
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            if (cmd) {
                print(`> ${cmd}`, 0);
                execute(cmd);
                input.value = '';
            }
        }
        if (e.key === 'Escape') {
            closeConsole();
        }
    });
});