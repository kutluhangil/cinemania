import { getMovieDetails } from './api/movies-api.js';

const loader = document.querySelector('.popup-loader');
const overlay = document.querySelector('.popup-modal-overlay');
const closeBtn = document.querySelector('.popup-modal-close');
const libraryBtn = document.querySelector('.popup-add-library-btn');

const posterImg = document.querySelector('.popup-movie-poster img');
const titleEl = document.querySelector('.popup-movie-title');
const infoValues = document.querySelectorAll('.popup-movie-info .popup-value');
const descriptionEl = document.querySelector('.popup-movie-description');

const LIBRARY_KEY = 'my-library';

async function openMoviePopup(movieId) {
  overlay.classList.add('is-active');
  loader.classList.remove('is-hidden');

  try {
    const movie = await getMovieDetails(movieId);

    posterImg.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '';

    titleEl.textContent = movie.title || 'Unknown title';

    infoValues[0].textContent = movie.vote_average
      ? `${movie.vote_average} / ${movie.vote_count}`
      : 'N/A';

    infoValues[1].textContent = movie.popularity
      ? movie.popularity.toFixed(1)
      : 'N/A';

    infoValues[2].textContent = movie.genres?.length
      ? movie.genres.map(g => g.name).join(', ')
      : 'Unknown';

    descriptionEl.textContent = movie.overview || 'No description available.';

    libraryBtn.textContent = isInLibrary(movie.id)
      ? 'Remove from My Library'
      : 'Add to My Library';

    libraryBtn.onclick = () => toggleLibrary(movie);
  } catch (error) {
    console.error('Movie details error:', error);
  } finally {
    loader.classList.add('is-hidden');
  }
}

function closeMoviePopup() {
  overlay.classList.remove('is-active');
}

function getLibrary() {
  return JSON.parse(localStorage.getItem(LIBRARY_KEY)) || [];
}

function isInLibrary(id) {
  return getLibrary().some(movie => movie.id === id);
}

function toggleLibrary(movie) {
  let library = getLibrary();

  if (isInLibrary(movie.id)) {
    library = library.filter(item => item.id !== movie.id);
    libraryBtn.textContent = 'Add to My Library';
  } else {
    library.push(movie);
    libraryBtn.textContent = 'Remove from My Library';
  }

  localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
}

closeBtn.addEventListener('click', closeMoviePopup);

overlay.addEventListener('click', e => {
  if (e.target === overlay) closeMoviePopup();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMoviePopup();
});

export { openMoviePopup };
