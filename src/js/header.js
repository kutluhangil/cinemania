// src/js/header.js
export function initHeader() {
  // Mobil menü
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
    });
  }

  // Tema (ilk yükleme)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.add(`${savedTheme}-theme`);

  // Tema toggle
  const themeToggle = document.querySelector('.theme-toggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-theme');

      document.body.classList.toggle('light-theme', !isLight);
      document.body.classList.toggle('dark-theme', isLight);

      localStorage.setItem('theme', isLight ? 'dark' : 'light');
    });
  }
}
