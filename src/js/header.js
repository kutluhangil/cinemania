const THEME_KEY = 'cinemania-theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

function applyTheme(theme) {
  const body = document.body;

  // always keep exactly one
  body.classList.remove('dark-theme', 'light-theme');

  if (theme === THEME_LIGHT) {
    body.classList.add('light-theme');
  } else {
    body.classList.add('dark-theme');
  }
}

function getSavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === THEME_LIGHT ? THEME_LIGHT : THEME_DARK; // default dark
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function initThemeToggle() {
  const toggleBtn = document.querySelector('.theme-toggle');
  if (!toggleBtn) return;

  // apply on load
  applyTheme(getSavedTheme());

  toggleBtn.addEventListener('click', () => {
    const current = document.body.classList.contains('light-theme') ? THEME_LIGHT : THEME_DARK;
    const next = current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;

    applyTheme(next);
    saveTheme(next);
  });
}

function initMobileMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const menuOverlay = document.querySelector('[data-menu]');

  if (!burgerBtn || !menuOverlay) return;

  const openMenu = () => menuOverlay.classList.remove('is-hidden');
  const closeMenu = () => menuOverlay.classList.add('is-hidden');

  burgerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // toggle
    if (menuOverlay.classList.contains('is-hidden')) openMenu();
    else closeMenu();
  });

  // close when clicking outside panel
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) closeMenu();
  });

  // close when clicking link
  menuOverlay.addEventListener('click', (e) => {
    const link = e.target.closest('.mobile-menu-link');
    if (link) closeMenu();
  });

  // close on Esc
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

export function initHeader() {
  initThemeToggle();
  initMobileMenu();
}
