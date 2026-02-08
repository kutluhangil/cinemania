import './css/styles.css';
import './css/header.css';
import './css/my-library-hero.css';
import './css/pop-up-movie-card.css';

import { initHeader } from './js/header.js';
import { initCatalog } from './js/catalog.js';
import { startHeroApp } from './js/hero.js';
import { initMyLibrary } from './js/my-library.js';
import { initializeMyLibraryHero } from './js/my-library-hero.js';
import { initFooter } from './js/footer.js';
import './js/pop-up-movie-card.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initFooter();

  const isLibraryPage = document.querySelector('.library-section') !== null;

  if (isLibraryPage) {
    initializeMyLibraryHero();
    initMyLibrary();
  } else {
    initCatalog();
    startHeroApp();
  }
});
