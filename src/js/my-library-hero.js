// Modüller
import { BASE_URL, API_KEY } from './api/movies-api.js';
import { renderMoviePopup } from './pop-up-movie-card.js';
import { renderTrailerPopup as externalRenderTrailer } from './pop-up-trailer-card.js';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const FALLBACK_IMAGE = '../img/library-hero-image.jpg';

// Loader
const myLibraryHeroLoader = document.querySelector('.my-library-hero__loader');

function showLoader() {
  myLibraryHeroLoader?.classList.remove('is-hidden');
}

function hideLoader() {
  myLibraryHeroLoader?.classList.add('is-hidden');
}

// Error popup
function showErrorPopup() {
  const errorPopup = document.getElementById('my-library-error-popup');
  if (errorPopup) errorPopup.classList.add('show');
}

function closeErrorPopup() {
  const errorPopup = document.getElementById('my-library-error-popup');
  if (errorPopup) errorPopup.classList.remove('show');
}

// Tema 
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.remove('dark-theme', 'light-theme');
  document.body.classList.add(`${savedTheme}-theme`);
}

function myRenderTrailerPopup(videoKey) {
  const modal = document.getElementById('my-library-video-modal');
  const iframe = document.getElementById('my-library-trailer-video');

  if (modal && iframe) {
    iframe.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
    modal.classList.remove('modal-hidden');
  }
}

function renderTrailerPopup(videoKey) {
  // renderTrailerPopup 
  if (typeof externalRenderTrailer === 'function') {
    try {
      externalRenderTrailer(videoKey);
      
      // Eğer modal açıldıysa başarılı
      const externalModal = document.getElementById('video-modal');
      if (externalModal && !externalModal.classList.contains('modal-hidden')) {
        return;
      }
    } catch (error) {
      console.warn('External trailer popup failed, using My Library popup:', error);
    }
  }
  
  // Eğer external çalışmazsa kendi modalını kullan
  myRenderTrailerPopup(videoKey);
}

// My Library video modal kapatma
function closeMyLibraryVideoModal() {
  const modal = document.getElementById('my-library-video-modal');
  const iframe = document.getElementById('my-library-trailer-video');
  
  if (modal && iframe) {
    modal.classList.add('modal-hidden');
    iframe.src = '';
  }
}

// My Library Hero
async function initializeMyLibraryHero() {
  try {
    const userMovies = getUserMoviesFromLocalStorage();

    if (userMovies && userMovies.length > 0) {
      const randomMovie = getRandomMovieFromUserLibrary(userMovies);
      displayMyLibraryHero(randomMovie);
    } else {
      displayDefaultMyLibraryHero();
    }
  } catch (error) {
    console.error('Error initializing my library hero:', error);
    displayDefaultMyLibraryHero();
  }
}

// LocalStorage
function getUserMoviesFromLocalStorage() {
  try {
    const savedMovies = localStorage.getItem('my-library');
    return savedMovies ? JSON.parse(savedMovies) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

// Rastgele film
function getRandomMovieFromUserLibrary(movies) {
  if (!movies || movies.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * movies.length);
  return movies[randomIndex];
}

// Yıldız
function generateStarRating(rating) {
  const starCount = rating / 2;
  const fullStars = Math.floor(starCount);
  const hasHalfStar = starCount % 1 >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="star filled">★</span>';
  }

  if (hasHalfStar) {
    starsHTML += '<span class="star half">★</span>';
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<span class="star empty">★</span>';
  }

  return starsHTML;
}

// DOM
function displayMyLibraryHero(movie) {
  if (!movie) {
    displayDefaultMyLibraryHero();
    return;
  }

  const myLibraryHeroSection = document.querySelector('.my-library-hero');
  const myLibraryHeroOverlay = document.querySelector('.my-library-hero__overlay');

  if (!myLibraryHeroSection || !myLibraryHeroOverlay) {
    console.error('Hero elements not found!');
    return;
  }

  const backgroundImage = movie.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : FALLBACK_IMAGE;

  myLibraryHeroSection.style.backgroundImage = `url('${backgroundImage}')`;

  const overview =
    movie.overview?.length > 180
      ? `${movie.overview.slice(0, 180)}...`
      : movie.overview || 'No description available.';

  const starRating = movie.vote_average
    ? generateStarRating(movie.vote_average)
    : '';

  myLibraryHeroOverlay.innerHTML = `
    <h1 class="my-library-hero__title">${movie.title}</h1>
    ${starRating ? `<div class="my-library-hero__rating">${starRating}</div>` : ''}
    <p class="my-library-hero__description">${overview}</p>
    <div class="my-library-hero__buttons">
      <button class="my-library-hero__btn my-library-hero__btn--trailer" id="my-library-hero-trailer-btn">
        Watch trailer
      </button>
      <button class="my-library-hero__btn my-library-hero__btn--details" id="my-library-hero-details-btn">
        More details
      </button>
    </div>
  `;

  attachMyLibraryHeroButtonListeners(movie.id);
}

// Buton
function attachMyLibraryHeroButtonListeners(movieId) {
  const detailsBtn = document.getElementById('my-library-hero-details-btn');
  const trailerBtn = document.getElementById('my-library-hero-trailer-btn');
  
  if (detailsBtn) {
    const newDetailsBtn = detailsBtn.cloneNode(true);
    detailsBtn.parentNode.replaceChild(newDetailsBtn, detailsBtn);
    newDetailsBtn.addEventListener('click', () => handleShowMovieDetails(movieId));
  }
  
  if (trailerBtn) {
    const newTrailerBtn = trailerBtn.cloneNode(true);
    trailerBtn.parentNode.replaceChild(newTrailerBtn, trailerBtn);
    newTrailerBtn.addEventListener('click', () => handleShowTrailer(movieId));
  }
}

// Detay modal
async function handleShowMovieDetails(movieId) {
  showLoader();
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-us`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const movie = await response.json();
    renderMoviePopup(movie);
  } catch (error) {
    console.error('Error loading movie details:', error);
    showErrorPopup(); 
  } finally {
    hideLoader(); 
  }
}

// Fragman modal
async function handleShowTrailer(movieId) {
  showLoader(); 
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-us`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const trailer = data.results?.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );

    if (trailer) {
      renderTrailerPopup(trailer.key);
    } else {
      showErrorPopup(); 
    }
  } catch (error) {
    console.error('Error loading trailer:', error);
    showErrorPopup(); 
  } finally {
    hideLoader(); 
  }
}

// Default Hero
function displayDefaultMyLibraryHero() {
  const myLibraryHeroSection = document.querySelector('.my-library-hero');
  const myLibraryHeroOverlay = document.querySelector('.my-library-hero__overlay');

  if (myLibraryHeroSection) {
    myLibraryHeroSection.style.backgroundImage = `url('${FALLBACK_IMAGE}')`;
  }

  if (!myLibraryHeroOverlay) return;

  myLibraryHeroOverlay.innerHTML = `
    <h1 class="my-library-hero__title">Create Your Dream Cinema</h1>
    <p class="my-library-hero__description">
      Is a guide to designing a personalized movie theater experience with the right equipment,
      customized decor, and favorite films.
    </p>
  `;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.my-library-hero')) return;

  loadSavedTheme();
  initializeMyLibraryHero();
  
  // Error popup
  const errorCloseBtn = document.querySelector('.my-library-error__close');
  if (errorCloseBtn) {
    errorCloseBtn.addEventListener('click', closeErrorPopup);
  }
  
  const errorPopup = document.getElementById('my-library-error-popup');
  if (errorPopup) {
    errorPopup.addEventListener('click', (e) => {
      if (e.target.id === 'my-library-error-popup') {
        closeErrorPopup();
      }
    });
  }
  
  // X butonu
  const closeVideoBtn = document.querySelector('.close-my-library-video');
  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', closeMyLibraryVideoModal);
  }

  // Modal dışı
  const videoModal = document.getElementById('my-library-video-modal');
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target.id === 'my-library-video-modal') {
        closeMyLibraryVideoModal();
      }
    });
  }
  
  // ESC tuşu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Error popup
      const errorPopup = document.getElementById('my-library-error-popup');
      if (errorPopup?.classList.contains('show')) {
        closeErrorPopup();
      }

      // Video modal
      const videoModal = document.getElementById('my-library-video-modal');
      if (videoModal && !videoModal.classList.contains('modal-hidden')) {
        closeMyLibraryVideoModal();
      }
    }
});
});

// Export
export { initializeMyLibraryHero };
