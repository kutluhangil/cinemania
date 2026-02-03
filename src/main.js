import './css/styles.css';
import './css/header.css';
import { initHeader } from './js/header.js';
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
});

//import { initHeader } from './js/header';

//document.addEventListener('DOMContentLoaded', () => {
//  initHeader();
//});
import { startHeroApp } from './js/hero';

startHeroApp();
