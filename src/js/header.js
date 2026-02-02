export function initHeader() {
  // ACTIVE LINKS
  const setActive = (selector) => {
    const links = document.querySelectorAll(selector);
    const currentPath = window.location.pathname;

    links.forEach((link) => {
      try {
        const linkPath = new URL(link.href).pathname;
        link.classList.toggle('active', linkPath === currentPath);
      } catch {}
    });
  };

  setActive('.header__link');
  setActive('.mobile-menu__link');

  // MOBILE MENU
  const menuBtn = document.getElementById('burger-btn');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const menu = document.getElementById('mobile-menu');

  const openMenu = () => {
    backdrop.classList.remove('is-hidden');
    menu.classList.remove('is-hidden');
    requestAnimationFrame(() => {
      menu.style.transform = 'translateX(0)';
    });
  };

  const closeMenu = () => {
    menu.style.transform = 'translateX(-105%)';
    setTimeout(() => {
      backdrop.classList.add('is-hidden');
      menu.classList.add('is-hidden');
    }, 250);
  };

  if (menuBtn && backdrop && menu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    menu.addEventListener('click', (e) => {
      if (e.target.matches('a')) closeMenu();
    });
  }


 // ---------- THEME (default: dark) ----------
const switcher = document.getElementById('theme-switcher');
const KEY = 'cinemania-theme';

const applyTheme = (mode) => {
  // mode: 'dark' | 'light'
  document.body.classList.toggle('light-theme', mode === 'light');
  document.body.classList.toggle('dark-theme', mode !== 'light');
};

// sayfa açılır açılmaz uygula (yoksa dark)
applyTheme(localStorage.getItem(KEY) || 'dark');

if (switcher) {
  switcher.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    localStorage.setItem(KEY, next);
    applyTheme(next);
  });
}
}