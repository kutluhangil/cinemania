// CSS
import './css/styles.css';
import './css/header.css';

// Header fonksiyonu
import { initHeader } from './js/header.js';

// API
import './js/api/movies-api.js';

console.log('Cinemania Projesi Aktif!');

async function injectPartial(selector, url) {
  const container = document.querySelector(selector);
  if (!container) return;

  const res = await fetch(url);
  const html = await res.text();
  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
  await injectPartial('#header', './partials/header.html');
  initHeader();
  await injectPartial('#main-content', './partials/hero.html');
  await injectPartial('#footer', './partials/footer.html');
});
