// CSS
import '../css/styles.css';
import '../css/header.css';
import '../css/weekly-trends.css';

// Header
import { initHeader } from './header';

// Hero
import './hero';
import './hero-tmdb';

// Sections
import './weekly-trends';
import './upcoming-this-month';

// Modals
import './modal';
import './pop-up-movie-card';
import './pop-up-trailer-card';

// Library
import './my-library';
import './my-library-hero';

// API (side-effect)
import './api/movies-api';

console.log('🎬 Cinemania Projesi Aktif');

// Header init (DOM zaten var olduğu için)
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
});
