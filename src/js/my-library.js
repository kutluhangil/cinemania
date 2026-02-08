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

const PER_PAGE = 9;
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
  if (!errorBox) return;
  errorBox.classList.remove('hidden');
}

function hideError() {
  if (!errorBox) return;
  errorBox.classList.add('hidden');
}

/* ======================================================
   DATA NORMALIZATION
   Eksik gelen film verilerini standart hale getirir
====================================================== */

function normalizeMovie(movie) {
  const rawGenre =
    Array.isArray(movie.genre) ? movie.genre[0] : movie.genre;
  const genreLabel = rawGenre ? String(rawGenre).trim() : 'Unknown';
  const genreKey = genreLabel.toLowerCase();

  return {
    ...movie,
    year: movie.year || '2023',
    rating: movie.rating || (Math.random() * 3 + 7).toFixed(1),
    genre: genreLabel,
    _genreKey: genreKey,
  };
}

/* ======================================================
   RATING STARS
   Rating değerine göre yıldız SVG'lerini üretir
====================================================== */

function createStarsSVG(rating) {
  const score = Number(rating) / 2;
  const full = Math.round(score);
  const empty = 5 - full;

  let stars = '';

  for (let i = 0; i < full; i++) {
    stars += `<img class="star" src="/assets/star-icon-filled.svg" alt="star" />`;
  }

  for (let i = 0; i < empty; i++) {
    stars += `<img class="star" src="/assets/star-icon.svg" alt="star" />`;
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
   DEMO SEED
   Kütüphane boşsa örnek film verisi ekler
====================================================== */

function seedLibraryIfEmpty() {
  const existing = getLibraryMovies();
  if (Array.isArray(existing) && existing.length >= 12) return;

  const demoMovies = [
    {
      id: 101,
      title: 'Ghosted',
      poster_path: '/liLN69YgoovHVgmlHJ876PKi5Yi.jpg',
      genre: 'Action',
      year: '2023',
      rating: 6.5,
    },
    {
      id: 102,
      title: 'Ant-Man and the Wasp: Quantumania',
      poster_path: '/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg',
      genre: 'Action',
      year: '2023',
      rating: 6.1,
    },
    {
      id: 103,
      title: 'Evil Dead Rise',
      poster_path: '/5ik4ATKmNtmJU6AYD0bLm56BCVM.jpg',
      genre: 'Horror',
      year: '2023',
      rating: 6.9,
    },
    {
      id: 104,
      title: 'The Super Mario Bros. Movie',
      poster_path: '/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg',
      genre: 'Animation',
      year: '2023',
      rating: 7.2,
    },
    {
      id: 105,
      title: 'Dead Ringers',
      poster_path: '/3GZB7pnyAw6QV053TwxiqvRyOw3.jpg',
      genre: 'Drama',
      year: '2023',
      rating: 6.7,
    },
    {
      id: 106,
      title: 'The Mandalorian',
      poster_path: '/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg',
      genre: 'Sci-Fi',
      year: '2023',
      rating: 8.5,
    },
    {
      id: 107,
      title: "A Tourist's Guide to Love",
      poster_path: '/z5oRHIL7fZ3d1qRd1jlwWw8WZxw.jpg',
      genre: 'Romance',
      year: '2023',
      rating: 6.4,
    },
    {
      id: 108,
      title: 'The Diplomat',
      poster_path: '/cOKXV0FalCYixNmZYCfHXgyQ0VX.jpg',
      genre: 'Thriller',
      year: '2023',
      rating: 7.7,
    },
    {
      id: 109,
      title: 'Avatar: The Way of Water',
      poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      genre: 'Fantasy',
      year: '2022',
      rating: 7.6,
    },
    {
      id: 110,
      title: 'John Wick',
      poster_path: '/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg',
      genre: 'Action',
      year: '2014',
      rating: 7.4,
    },
    {
      id: 111,
      title: 'Coco',
      poster_path: '/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
      genre: 'Animation',
      year: '2017',
      rating: 8.4,
    },
    {
      id: 112,
      title: 'Parasite',
      poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      genre: 'Thriller',
      year: '2019',
      rating: 8.5,
    },
  ];

  localStorage.setItem('library', JSON.stringify(demoMovies));
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
  // Keep controls visible even when library is empty
  if (controlsBox) {
    controlsBox.classList.remove('hidden');
  }

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
      seedLibraryIfEmpty();
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
  if (!document.querySelector('.library-section')) return;
  initLibrary();
}

/* ======================================================
   GENRE LIST CREATION
   Film türlerini dinamik olarak üretir
====================================================== */

function fillGenres(movies) {
  if (!genreMenu) return;

  const genres = [
    { key: 'romance', label: 'Romance' },
    { key: 'detective', label: 'Detective' },
    { key: 'thriller', label: 'Thriller' },
    { key: 'action', label: 'Action' },
    { key: 'documentary', label: 'Documentary' },
    { key: 'horror', label: 'Horror' },
  ];

  genreMenu.innerHTML = genres
    .map(
      g => `
        <li data-genre="${g.key}" class="${g.key === 'action' ? 'active' : ''}">
          ${g.label}
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
  if (!genreMenu || !genreText || !genreBtn) return;
  const items = genreMenu.querySelectorAll('li');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const genre = item.dataset.genre;

      genreText.textContent = 'Genre';

      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      genreMenu.classList.remove('open');
      genreBtn.classList.remove('active');

      allMovies = libraryMovies.filter(movie => movie._genreKey === genre);

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
  if (!genreMenu || !genreBtn) return;
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

if (listEl) {
  listEl.addEventListener('click', e => {
    const card = e.target.closest('.movie-card');
    if (!card) return;

    const movieId = card.dataset.id;
    const movie = allMovies.find(m => String(m.id) === movieId);
    if (!movie) return;

    openMovieModal(movie);
  });
}
