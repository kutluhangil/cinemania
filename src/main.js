import './css/header.css';
import './css/my-library-hero.css';


import { initHeader } from './js/header';
import { initializeMyLibraryHero } from './js/my-library-hero.js';
import './js/my-library-hero.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initializeMyLibraryHero();
});

