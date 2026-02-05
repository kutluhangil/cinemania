import './css/styles.css';
import './css/header.css';
import './css/my-library-hero.css';

import { initHeader } from './js/header.js';
import { initCatalog } from './js/catalog.js';
import { startHeroApp } from './js/hero.js';
import { initMyLibrary } from './js/my-library.js';
import { initializeMyLibraryHero } from './js/my-library-hero.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  
  // Sayfa kontrolü
  const isLibraryPage = document.querySelector('.library-section') !== null;
  
  if (isLibraryPage) {
    // My Library sayfasındayız
    initializeMyLibraryHero();
    initMyLibrary();
  } else {
    // Ana sayfadayız
    initCatalog();
    startHeroApp();
  }
});

import { initFooter } from './js/footer.js';
document.addEventListener('DOMContentLoaded', () => {
  initFooter();
});

startHeroApp();
