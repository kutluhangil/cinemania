// src/js/header.js
export function initHeader() {
  // --- 1. MOBİL MENÜ MANTIĞI (Popcorn İkonu ile) ---
  // Figma tasarımına göre mobilde menüyü popcorn logosu açıyor
  const logoBtn = document.querySelector('.header-logo'); 
  const mobileMenu = document.querySelector('.mobile-menu');

  if (logoBtn && mobileMenu) {
    logoBtn.addEventListener('click', (e) => {
      // Sadece mobildeysek (768px'den küçük ekranlarda) menüyü aç
      if (window.innerWidth < 768) {
        // Linkin (index.html) çalışmasını engellemek için preventDefault kullanıyoruz
        e.preventDefault(); 
        mobileMenu.classList.toggle('is-open');
      }
    });

    // Menü açıkken herhangi bir linke tıklandığında menüyü kapat
    mobileMenu.addEventListener('click', (e) => {
      // Tıklanan şey bir link ise veya menünün dışındaki boş alansa kapat
      if (e.target.classList.contains('mobile-menu-link') || e.target === mobileMenu) {
        mobileMenu.classList.remove('is-open');
      }
    });
  }

  // --- 2. TEMA YÖNETİMİ (Dark/Light Mode) ---
  // Sayfa ilk yüklendiğinde hafızadaki temayı al (yoksa varsayılan 'dark' yap)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.className = `${savedTheme}-theme`;

  const themeToggle = document.querySelector('.theme-toggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-theme');

      // Mevcut temanın tersine geçiş yap
      document.body.classList.toggle('light-theme', !isLight);
      document.body.classList.toggle('dark-theme', isLight);

      // Yeni tema tercihini hafızaya (localStorage) kaydet
      localStorage.setItem('theme', isLight ? 'dark' : 'light');
    });
  }
}