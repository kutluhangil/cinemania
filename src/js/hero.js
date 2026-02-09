import { API_KEY, BASE_URL } from './api/movies-api.js';
import { createLoader } from './loader.js';
import { getDailyTrending } from './api/movies-api.js';
import { openMoviePopup } from './pop-up-movie-card.js';
const IMAGE_URL = 'https://image.tmdb.org/t/p/original';

// Yardımcı fonksiyon: Elementin varlığını kontrol eder
const getEl = id => document.getElementById(id);

export async function initHero() {
  showHeroLoader();
  try {
    const results = await getDailyTrending();
    if (results && results.length > 0) {
      const randomMovie =
        results[Math.floor(Math.random() * results.length)];
      displayMovie(randomMovie);
    } else {
      displayDefaultHero();
    }
  } catch (error) {
    displayDefaultHero();
  } finally {
    removeHeroLoader();
  }
}

function displayMovie(movie) {
  const heroSection = getEl('hero');
  const title = getEl('hero-title');
  const desc = getEl('hero-description');
  const trailerBtn = getEl('watch-trailer');
  const detailsBtn = getEl('more-details');
  const ratingContainer = getEl('hero-rating');

  if (heroSection) {
    heroSection.classList.remove('hero-default');
    heroSection.style.backgroundImage = `url(${IMAGE_URL}${movie.backdrop_path})`;
  }
  if (title) title.innerText = movie.title;
  if (desc) desc.innerText = movie.overview.slice(0, 150) + '...';

  if (trailerBtn) {
    trailerBtn.onclick = () => getTrailer(movie.id);
  }

  if (detailsBtn) {
    detailsBtn.onclick = () => {
      if (typeof openMoviePopup === 'function') {
        openMoviePopup(movie.id);
      } else if (
        typeof window !== 'undefined' &&
        typeof window.openMoviePopup === 'function'
      ) {
        window.openMoviePopup(movie.id);
      } else {
        console.log('Details modal is not ready.');
      }
    };
  }

  if (ratingContainer) {
    ratingContainer.innerHTML = renderHeroStars(movie.vote_average);
  }
}

function renderHeroStars(rating) {
  const value = Number(rating);
  if (!Number.isFinite(value)) return '';

  const starCount = value / 2;
  const fullStars = Math.floor(starCount);
  const hasHalfStar = starCount % 1 >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="star-item star-filled"></span>';
  }

  if (hasHalfStar) {
    starsHTML += '<span class="star-item star-half"></span>';
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<span class="star-item star-empty"></span>';
  }

  return starsHTML;
}

async function getTrailer(movieId) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    const trailer = data.results.find(
      v => v.type === 'Trailer' && v.site === 'YouTube'
    );

    if (trailer) {
      openVideoModal(trailer.key);
    } else {
      showErrorPopup();
    }
  } catch (error) {
    console.error('Fragman yüklenirken hata oluştu:', error);
    showErrorPopup();
  }
}

function showErrorPopup() {
  const errorPopup = getEl('error-popup');
  if (errorPopup) errorPopup.classList.add('show');
}

export function openVideoModal(videoKey) {
  const modal = getEl('video-modal');
  const iframe = getEl('trailer-video');

  if (modal && iframe) {
    iframe.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
    modal.classList.add('show');
  }
}

// Olay dinleyicilerini güvenli bir şekilde başlatan fonksiyon
function setupEventListeners() {
  const videoModal = getEl('video-modal');
  const errorModal = getEl('error-popup');
  const videoIframe = getEl('trailer-video');

  const closeVideoBtn = document.querySelector('.close-video');
  if (closeVideoBtn && videoModal && videoIframe) {
    closeVideoBtn.onclick = () => {
      videoModal.classList.remove('show');
      videoIframe.src = '';
    };
  }

  const closeErrorBtn = document.querySelector('#error-popup .close-btn');
  if (closeErrorBtn && errorModal) {
    closeErrorBtn.onclick = () => {
      errorModal.classList.remove('show');
    };
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (videoModal && videoIframe) {
        videoModal.classList.remove('show');
        videoIframe.src = '';
      }
      if (errorModal) {
        errorModal.classList.remove('show');
      }
    }
  });

  window.onclick = event => {
    if (event.target === videoModal) {
      videoModal.classList.remove('show');
      videoIframe.src = '';
    }
    if (event.target === errorModal) {
      errorModal.classList.remove('show');
    }
  };
}

function displayDefaultHero() {
  const heroSection = getEl('hero');
  const title = getEl('hero-title');
  const desc = getEl('hero-description');
  const ratingContainer = getEl('hero-rating');
  const buttonsContainer = document.querySelector('.hero-buttons');

  if (heroSection) {
    heroSection.classList.add('hero-default');
    heroSection.style.backgroundImage = 'url(/src/assets/default-cover.png)';
  }

  if (title) title.innerText = "Let's Make Your Own Cinema";

  if (desc) {
    desc.innerText =
      "Is a guide to creating a personalized movie theater experience. You'll need a projector, screen, and speakers. Decorate your space, choose your films, and stock up on snacks for the full experience.";
  }

  if (ratingContainer) {
    ratingContainer.innerHTML = '';
  }

  if (buttonsContainer) {
    buttonsContainer.innerHTML =
      '<a class="btn btn-orange" href="/catalog.html">Get Started</a>';
  }
}

function showHeroLoader() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;
  if (heroContent.querySelector('.app-loader')) return;
  const loader = createLoader('Loading...');
  loader.id = 'hero-loader';
  heroContent.prepend(loader);
}

function removeHeroLoader() {
  const loader = document.getElementById('hero-loader');
  if (loader) loader.remove();
}

export async function startHeroApp() {
  setupEventListeners();
  await initHero();
}
