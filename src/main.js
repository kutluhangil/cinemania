<<<<<<< HEAD
import "./js/upcoming-this-mounth.js";

=======
import './css/styles.css';
import './css/header.css';
import './css/my-library-hero.css';
import './css/pop-up-movie-card.css';

<<<<<<< HEAD
//document.addEventListener('DOMContentLoaded', () => {
//  initHeader();
//});
>>>>>>> cdea60d8898fbe3e8c9788cb3f765b98741a4fe2
=======
import { initHeader } from './js/header.js';
import { initCatalog } from './js/catalog.js';
import { startHeroApp } from './js/hero.js';
import { initMyLibrary } from './js/my-library.js';
import { initializeMyLibraryHero } from './js/my-library-hero.js';
import { initFooter } from './js/footer.js';
import './js/pop-up-movie-card.js';
>>>>>>> 0fa2a53f0d7983dbe0a8431f8edbc032be3b7787

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
