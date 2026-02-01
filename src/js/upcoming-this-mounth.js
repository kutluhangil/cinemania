const API_KEY = 'c43a3c633ad33367e1cd1eb02f47a173'; // Senin API keyin
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const LIB_KEY = 'myLibrary';

// DOM Elementleri
const wrapper = document.getElementById('upcoming-wrapper');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
const modalCloseBtn = document.getElementById('modalClose');

// Global Değişkenler
let genresMap = {}; // ID -> İsim eşleşmesi için

// Başlangıç
document.addEventListener('DOMContentLoaded', initUpcoming);

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
  document.getElementById('posterClick').addEventListener('click', () => openModal(movie));
  document.getElementById('titleClick').addEventListener('click', () => openModal(movie));
  
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
  return JSON.parse(localStorage.getItem(LIB_KEY)) || [];
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

/* ===== MODAL MANTIĞI ===== */
function openModal(movie) {
  const genreNames = movie.genre_ids.map(id => genresMap[id]).join(', ');
  const isSaved = isInLibrary(movie.id);

  // Modal İçeriği (Figma'daki Pop Up Tasarımı)
  modalContent.innerHTML = `
    <img src="${IMG_URL}${movie.poster_path}" class="modal-poster" alt="${movie.title}">
    <div class="modal-info">
      <h3 style="font-size:24px; text-transform:uppercase; margin-bottom:10px;">${movie.title}</h3>
      
      <div style="display:grid; grid-template-columns: auto 1fr; gap: 5px 20px; margin-bottom:15px; font-size:14px;">
        <span>Vote / Votes</span> <span>${movie.vote_average.toFixed(1)} / ${movie.vote_count}</span>
        <span>Popularity</span> <span>${movie.popularity.toFixed(1)}</span>
        <span>Genre</span> <span>${genreNames}</span>
      </div>

      <h5 style="margin-bottom:5px;">ABOUT</h5>
      <p style="font-size:14px; line-height:1.5; color:#555; margin-bottom:20px;">${movie.overview}</p>

      <button class="btn-library ${isSaved ? 'remove' : 'add'}" id="modalLibBtn">
        ${isSaved ? 'Remove from my library' : 'Add to my library'}
      </button>
    </div>
  `;

  // Modal butonuna da event ekle
  const modalBtn = document.getElementById('modalLibBtn');
  modalBtn.addEventListener('click', () => {
    toggleLibrary(movie);
    updateButtonState(modalBtn, isInLibrary(movie.id));
    
    // Ana ekrandaki butonu da senkronize et (varsa)
    const mainBtn = document.getElementById('libraryBtn');
    if(mainBtn) updateButtonState(mainBtn, isInLibrary(movie.id));
  });

  modalBackdrop.classList.add('is-open');
  document.body.style.overflow = 'hidden'; // Arka plan scroll olmasın
}

// Modalı Kapatma İşlemleri
function closeModal() {
  modalBackdrop.classList.remove('is-open');
  document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

// ESC tuşu ile kapatma
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
    closeModal();
  }
});