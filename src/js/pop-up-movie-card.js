import { getMovieDetails } from './api/movies-api.js';

const LIBRARY_KEY = 'my-library';

let loader;
let overlay;
let closeBtn;
let libraryBtn;

let posterImg;
let titleEl;
let infoValues;
let descriptionEl;

function initPopup() {
  overlay = document.querySelector('.popup-modal-overlay');
  loader = document.querySelector('.popup-loader');
  closeBtn = document.querySelector('.popup-modal-close');
  libraryBtn = document.querySelector('.popup-add-library-btn');

  posterImg = document.querySelector('.popup-movie-poster img');
  titleEl = document.querySelector('.popup-movie-title');
  infoValues = document.querySelectorAll('.popup-movie-info .popup-value');
  descriptionEl = document.querySelector('.popup-movie-description');

  if (!overlay) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMoviePopup);
  }

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeMoviePopup();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
      closeMoviePopup();
    }
  });
}

async function openMoviePopup(movieId) {
  if (!overlay || !loader) return;

  overlay.classList.add('is-active');
  loader.classList.remove('is-hidden');

  try {
    const movie = await getMovieDetails(movieId);

    if (posterImg) {
      posterImg.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '';
    }

    if (titleEl) {
      titleEl.textContent = movie.title || 'Unknown title';
    }

    if (infoValues.length >= 3) {
      if (movie.vote_average) {
        const voteAvg = movie.vote_average.toFixed(1);
        const voteCount = movie.vote_count ?? 0;
        infoValues[0].innerHTML = `
          <span class="popup-pill">${voteAvg}</span>
          <span class="popup-pill-sep">/</span>
          <span class="popup-pill">${voteCount}</span>
        `;
      } else {
        infoValues[0].textContent = 'N/A';
      }

      infoValues[1].textContent = movie.popularity
        ? movie.popularity.toFixed(1)
        : 'N/A';

      infoValues[2].textContent = movie.genres?.length
        ? movie.genres.map(g => g.name).join(', ')
        : 'Unknown';
    }

    if (descriptionEl) {
      descriptionEl.textContent = movie.overview || 'No description available.';
    }

    if (libraryBtn) {
      const inLibrary = isInLibrary(movie.id);
      libraryBtn.textContent = inLibrary
        ? 'Remove from my library'
        : 'Add to my library';
      libraryBtn.classList.toggle('is-remove', inLibrary);

      libraryBtn.onclick = () => toggleLibrary(movie);
    }
  } catch (error) {
    console.error('Movie details error:', error);
  } finally {
    loader.classList.add('is-hidden');
  }
}

function closeMoviePopup() {
  if (overlay) overlay.classList.remove('is-active');
}

function getLibrary() {
  return JSON.parse(localStorage.getItem(LIBRARY_KEY)) || [];
}

function isInLibrary(id) {
  return getLibrary().some(movie => movie.id === id);
}

function toggleLibrary(movie) {
  if (!libraryBtn) return;

  let library = getLibrary();

  if (isInLibrary(movie.id)) {
    library = library.filter(item => item.id !== movie.id);
    libraryBtn.textContent = 'Add to my library';
    libraryBtn.classList.remove('is-remove');
  } else {
    library.push(movie);
    libraryBtn.textContent = 'Remove from my library';
    libraryBtn.classList.add('is-remove');
  }

  localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
}

document.addEventListener('DOMContentLoaded', initPopup);

// Expose for catalog.js safe hook
if (typeof window !== 'undefined') {
  window.openMoviePopup = openMoviePopup;
}

export { openMoviePopup, openMoviePopup as renderMoviePopup };
