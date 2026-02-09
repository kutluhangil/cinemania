const API_KEY = 'c43a3c633ad33367e1cd1eb02f47a173'; // Senin API keyin
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const LIB_KEY = 'my-library';
const LEGACY_LIB_KEY = 'myLibrary';

// DOM Elementleri
const wrapper = document.getElementById('upcoming-wrapper');

// Global Değişkenler
let genresMap = {}; // ID -> İsim eşleşmesi için

// Başlangıç

async function initUpcoming() {
  try {
    // 1. Önce Türleri (Genres) Çek ve Haritala
    await fetchGenres();
    
    // 2. Sonra Filmleri Çek
    await fetchUpcomingMovie();
  } catch (error) {
    console.error('Hata:', error);
    wrapper.innerHTML = '<p>Film bilgileri yüklenemedi.</p>';
  }
}

export function initUpcomingThisMonth() {
  if (!wrapper) return;
  return initUpcoming();
}

// Tür Listesini Getir
async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await res.json();
  data.genres.forEach(g => {
    genresMap[g.id] = g.name;
  });
}

// Upcoming Filmleri Getir ve Rastgele Birini Seç
async function fetchUpcomingMovie() {
  // Bu ayın başlangıcı
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const startOfMonth = `${year}-${month}-01`;

  // API İsteği
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_date.gte=${startOfMonth}&sort_by=popularity.desc&include_adult=false&include_video=false`
  );
  const data = await res.json();
  const movies = data.results;

  if (movies.length > 0) {
    // Rastgele bir film seç (Sayfa yenilendikçe değişir)
    const randomIndex = Math.floor(Math.random() * movies.length);
    renderMovie(movies[randomIndex]);
  } else {
    wrapper.innerHTML = '<p>Bu ay için vizyon filmi bulunamadı.</p>';
  }
}

// Filmi Ekrana Bas (Figma Layout)
function renderMovie(movie) {
  // Tür ID'lerini İsimlere Çevir (En fazla 2 tane göster)
  const genreNames = movie.genre_ids
    .slice(0, 2)
    .map(id => genresMap[id])
    .join(', ');

  // Tarih Formatı (DD.MM.YYYY)
  const releaseDate = new Date(movie.release_date).toLocaleDateString('tr-TR');

  // Kütüphanede var mı?
  const isSaved = isInLibrary(movie.id);

  // HTML Şablonu
  const html = `
    <div class="upcoming-poster-container" id="posterClick">
      <img src="${IMG_URL}${movie.backdrop_path || movie.poster_path}" alt="${movie.title}">
    </div>

    <div class="upcoming-info-container">
      <h3 class="upcoming-movie-title" id="titleClick">${movie.title}</h3>
      
      <div class="upcoming-meta-grid">
        <span class="meta-label">Release date</span>
        <span class="meta-value highlight-date">${releaseDate}</span>

        <span class="meta-label">Vote / Votes</span>
        <span class="meta-value">
          <span class="vote-badge">${movie.vote_average.toFixed(1)}</span> / <span class="vote-count">${movie.vote_count}</span>
        </span>

        <span class="meta-label">Popularity</span>
        <span class="meta-value">${movie.popularity.toFixed(1)}</span>

        <span class="meta-label">Genre</span>
        <span class="meta-value">${genreNames}</span>
      </div>

      <div class="upcoming-about">
        <h4 class="upcoming-about-title">ABOUT</h4>
        <p class="upcoming-overview">${movie.overview}</p>
      </div>

      <button class="btn-library ${isSaved ? 'remove' : 'add'}" id="libraryBtn">
        ${isSaved ? 'Remove from my library' : 'Add to my library'}
      </button>
    </div>
  `;

  wrapper.innerHTML = html;

  // Event Listeners (Tıklama olayları)
  document.getElementById('posterClick').addEventListener('click', () => {
    openPopupSafe(movie.id);
  });
  document.getElementById('titleClick').addEventListener('click', () => {
    openPopupSafe(movie.id);
  });
  
  const btn = document.getElementById('libraryBtn');
  btn.addEventListener('click', () => {
    toggleLibrary(movie);
    // Butonu anlık güncelle (Sayfayı yenilemeye gerek yok)
    const newState = isInLibrary(movie.id);
    updateButtonState(btn, newState);
  });
}

// Buton Görünümünü Güncelle
function updateButtonState(btn, isSaved) {
  if (isSaved) {
    btn.textContent = 'Remove from my library';
    btn.classList.remove('add');
    btn.classList.add('remove');
  } else {
    btn.textContent = 'Add to my library';
    btn.classList.remove('remove');
    btn.classList.add('add');
  }
}

/* ===== KÜTÜPHANE MANTIĞI (Local Storage) ===== */
function getLibrary() {
  const current = JSON.parse(localStorage.getItem(LIB_KEY)) || [];
  if (current.length > 0) return current;

  // Migrate legacy storage if present
  const legacy = JSON.parse(localStorage.getItem(LEGACY_LIB_KEY)) || [];
  if (legacy.length > 0) {
    localStorage.setItem(LIB_KEY, JSON.stringify(legacy));
    localStorage.removeItem(LEGACY_LIB_KEY);
  }
  return legacy;
}

function isInLibrary(id) {
  return getLibrary().some(m => m.id === id);
}

function toggleLibrary(movie) {
  let lib = getLibrary();
  if (isInLibrary(movie.id)) {
    lib = lib.filter(m => m.id !== movie.id);
  } else {
    lib.push(movie);
  }
  localStorage.setItem(LIB_KEY, JSON.stringify(lib));
}

function openPopupSafe(movieId) {
  if (!movieId) return false;

  if (typeof window.openMoviePopup === 'function') {
    window.openMoviePopup(movieId);
    return true;
  }

  console.warn(
    'openMoviePopup bulunamadı. Popup modülü sayfaya yüklenmemiş olabilir.'
  );
  return false;
}
