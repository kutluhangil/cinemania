/* ======================================================
   DOM ELEMENT REFERENCES
   Sayfa üzerindeki gerekli HTML elementlerini seçiyoruz
====================================================== */

const listEl = document.querySelector('.library-list');
const loadMoreBtn = document.querySelector('.load-more-btn');
const emptyBox = document.querySelector('.library-empty');
const controlsBox = document.querySelector('.library-controls');

const genreBtn = document.getElementById('genreBtn');
const genreMenu = document.getElementById('genreMenu');
const genreText = document.getElementById('genreText');

const loaderBox = document.querySelector('.library-loader');
const errorBox = document.querySelector('.library-error');

/* ======================================================
   PAGINATION & STATE
   Sayfa başına film sayısı ve uygulama state'leri
====================================================== */

const PER_PAGE = 6;
let currentPage = 1;

// Tüm filmler (filtrelenmiş haliyle)
let allMovies = [];

// LocalStorage’dan gelen asıl kütüphane verisi
let libraryMovies = [];

/* ======================================================
   ERROR HANDLING
   Hata durumunda error box göster / gizle
====================================================== */

function showError() {
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}

/* ======================================================
   DATA NORMALIZATION
   Eksik gelen film verilerini standart hale getirir
====================================================== */

function normalizeMovie(movie) {
  return {
    ...movie,
    year: movie.year || '2023',
    rating: movie.rating || (Math.random() * 3 + 7).toFixed(1),
  };
}

/* ======================================================
   RATING STARS
   Rating değerine göre yıldız SVG'lerini üretir
====================================================== */

function createStarsSVG(rating) {
  const score = Number(rating) / 2;

  const full = Math.floor(score);
  const half = score % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  let stars = '';

  for (let i = 0; i < full; i++) {
    stars += `<img class="star" src="/assets/star.svg" alt="star" />`;
  }

  if (half) {
    stars += `<img class="star" src="/assets/star-half.svg" alt="star" />`;
  }

  for (let i = 0; i < empty; i++) {
    stars += `<img class="star" src="/assets/star-outline.svg" alt="star" />`;
  }

  return stars;
}

/* ======================================================
   LOCAL STORAGE
   Kullanıcının kütüphanesini LocalStorage'dan alır
====================================================== */

function getLibraryMovies() {
  return JSON.parse(localStorage.getItem('library')) || [];
}

/* ======================================================
   CARD TEMPLATE
   Tek bir film kartının HTML çıktısını üretir
====================================================== */

function createMovieCard(movie) {
  const stars = createStarsSVG(movie.rating);

  return `
    <li class="movie-card" data-id="${movie.id}">
      <div class="card-poster">
        <img 
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
          alt="${movie.title}" 
        />

        <div class="card-overlay">
          <h3 class="movie-title">${movie.title.toUpperCase()}</h3>

          <div class="card-bottom">
            <p class="movie-meta">
              ${movie.genre} | ${movie.year || '2024'}
            </p>

            <div class="movie-rating">
              ${stars}
            </div>
          </div>
        </div>
      </div>
    </li>
  `;
}

/* ======================================================
   RENDER
   Film listesini DOM'a basar
====================================================== */

function renderMovies(movies) {
  listEl.innerHTML = movies.map(createMovieCard).join('');
}

/* ======================================================
   PAGINATION LOGIC
   Mevcut sayfaya göre gösterilecek filmleri hesaplar
====================================================== */

function getVisibleMovies() {
  return allMovies.slice(0, currentPage * PER_PAGE);
}

/* ======================================================
   EMPTY STATE
   Liste boşsa empty ekranını yönetir
====================================================== */

function toggleEmpty(movies) {
  const isEmpty = movies.length === 0;

  emptyBox.classList.toggle('hidden', !isEmpty);
  listEl.classList.toggle('hidden', isEmpty);
  controlsBox.classList.toggle('hidden', isEmpty);

  if (loadMoreBtn) {
    loadMoreBtn.classList.toggle('hidden', isEmpty);
  }
}

/* ======================================================
   UI UPDATE
   Liste, empty state ve load more butonunu günceller
====================================================== */

function updateUI() {
  const visible = getVisibleMovies();

  renderMovies(visible);
  toggleEmpty(allMovies);

  if (!loadMoreBtn) return;

  if (visible.length < allMovies.length) {
    loadMoreBtn.classList.remove('hidden');
  } else {
    loadMoreBtn.classList.add('hidden');
  }
}

/* ======================================================
   LOAD MORE BUTTON
   Daha fazla film yüklemek için pagination artırılır
====================================================== */

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    updateUI();
  });
}

/* ======================================================
   GENRE DROPDOWN TOGGLE
====================================================== */

if (genreBtn && genreMenu) {
  genreBtn.addEventListener('click', () => {
    genreMenu.classList.toggle('open');
    genreBtn.classList.toggle('active');
  });
}

/* ======================================================
   INITIALIZATION
   Sayfa ilk açıldığında çalışan ana akış
====================================================== */

function initLibrary() {
  showLoader();
  hideError();

  try {
    setTimeout(() => {
      libraryMovies = getLibraryMovies().map(normalizeMovie);
      allMovies = [...libraryMovies];

      fillGenres(libraryMovies);
      updateUI();

      hideLoader();
    }, 800);
  } catch (err) {
    console.error(err);
    hideLoader();
    showError();
  }
}

/* ======================================================
   LOADER CONTROLS
====================================================== */

function showLoader() {
  if (!loaderBox) return;
  loaderBox.classList.remove('hidden');
  listEl.classList.add('hidden');
}

function hideLoader() {
  loaderBox.classList.add('hidden');
  listEl.classList.remove('hidden');
}

/* ======================================================
   EXPORTED INIT FUNCTION
   Dışarıdan çağrılacak ana giriş noktası
====================================================== */

export function initMyLibrary() {
  initLibrary();
}

/* ======================================================
   GENRE LIST CREATION
   Film türlerini dinamik olarak üretir
====================================================== */

function fillGenres(movies) {
  const genres = ['all'];

  movies.forEach(movie => {
    if (!genres.includes(movie.genre)) {
      genres.push(movie.genre);
    }
  });

  genreMenu.innerHTML = genres
    .map(
      genre => `
        <li data-genre="${genre}" class="${genre === 'all' ? 'active' : ''}">
          ${genre === 'all' ? 'All Genres' : genre}
        </li>
      `
    )
    .join('');

  attachGenreEvents();
}

/* ======================================================
   GENRE FILTER EVENTS
====================================================== */

function attachGenreEvents() {
  const items = genreMenu.querySelectorAll('li');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const genre = item.dataset.genre;

      genreText.textContent = item.textContent;

      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      genreMenu.classList.remove('open');
      genreBtn.classList.remove('active');

      allMovies =
        genre === 'all'
          ? [...libraryMovies]
          : libraryMovies.filter(movie => movie.genre === genre);

      currentPage = 1;
      updateUI();
    });
  });
}

/* ======================================================
   OUTSIDE CLICK
   Genre dropdown dışına tıklanınca kapanır
====================================================== */

document.addEventListener('click', e => {
  if (!e.target.closest('.genre-select')) {
    genreMenu.classList.remove('open');
    genreBtn.classList.remove('active');
  }
});

/* ======================================================
   MOVIE CARD CLICK
   Film kartına tıklanınca modal açılmak üzere hazırlanır
====================================================== */

function openMovieModal(movie) {
  console.log('TIKLANAN FILM:', movie);
}

listEl.addEventListener('click', e => {
  const card = e.target.closest('.movie-card');
  if (!card) return;

  const movieId = card.dataset.id;
  const movie = allMovies.find(m => String(m.id) === movieId);
  if (!movie) return;

  openMovieModal(movie);
});
