document.addEventListener('DOMContentLoaded', function () {
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');

  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', function (e) {
      e.preventDefault();
      // Переключаем классы
      navbarToggle.classList.toggle('active');
      navbarMenu.classList.toggle('active');
    });
  }

  // Закрытие меню при клике на ссылку
  document.querySelectorAll('#navbar-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
    });
  });
});