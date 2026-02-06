import { API_KEY, BASE_URL, IMAGE_BASE } from './api/movies-api.js';

export function initCatalog() {
  // ======================
  // STATE
  // ======================
  let selectedYearValue = '';
  let currentQuery = '';
  let hasSearched = false;
  let genreMap = {};

  let currentPage = 1;
  let currentMode = 'trending';

  // ======================
  // DOM
  // ======================
  const moviesContainer = document.getElementById('moviesContainer');
  const emptyMessage = document.getElementById('emptyMessage');

  if (!moviesContainer || !emptyMessage) return;

  const filmInput = document.querySelector('.search-input'); // ilk .search-input (Film inputu)
  const clearBtn = document.getElementById('clearSearch'); // HTML'de yok → aşağıda fallback var
  const searchBtn = document.querySelector('.search-btn');

  const yearBtn = document.getElementById('yearBtn');
  const yearDropdown = document.getElementById('yearDropdown');
  const selectedYear = document.getElementById('selectedYear');

  // ======================
  // SCROLL RESTORE
  // ======================
  if (sessionStorage.getItem('scrollCatalog') === 'true') {
    sessionStorage.removeItem('scrollCatalog');

    setTimeout(() => {
      const searchRow = document.querySelector('.search-row');
      if (!searchRow) return;

      const y = searchRow.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 300);
  }

  // ======================
  // Clear button (x) setup
  // ======================
  const input = document.querySelector('.search-input');
  if (!input) return;

  const parent = input.parentElement;
  if (!parent) return;

  const clearInputBtn = parent.querySelector('.search-clear-btn');
  if (clearInputBtn) clearInputBtn.style.display = 'none';

  // clearBtn id ile bulunamazsa class'tan yakala (HTML'e dokunmadan)
  const clearBtnSafe = clearBtn || clearInputBtn;

  // ======================
  // PAGINATION (ŞİMDİLİK NO-OP)
  // Not: setupPagination yorumdaydı ama çağrılıyordu, hata vermesin diye burada boş bırakıldı.
  // ======================
  function setupPagination(totalResults, page) {
    // İstersen sonra Pagination entegrasyonunu burada açarız.
    // Şimdilik hiçbir şey yapma.
  }

  // ======================
  // GENRES
  // ======================
  fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
    .then(r => r.json())
    .then(d => {
      (d.genres || []).forEach(g => (genreMap[g.id] = g.name));
    })
    .catch(err => console.error('genre list error:', err));

  // ======================
  // CLEAR (x) EVENTS
  // ======================
  parent.addEventListener('click', e => {
    const btn = e.target.closest('.search-clear-btn');
    if (!btn) return;

    input.value = '';
    input.focus();
    btn.style.display = 'none';

    // sadece input temizlemek istiyorsan burası yeter
    // full reset istiyorsan aşağıdaki gibi de yapabilirsin (şimdilik dokunmadım)
  });

  parent.addEventListener('input', e => {
    if (e.target !== input) return;
    const btn = parent.querySelector('.search-clear-btn');
    if (btn) btn.style.display = input.value ? 'block' : 'none';
  });

  if (clearInputBtn) {
    clearInputBtn.addEventListener('click', () => {
      filmInput.value = '';
      filmInput.focus();
      clearInputBtn.style.display = 'none';
    });
  }

  // ======================
  // YEAR DROPDOWN
  // ======================
  function setDropdownOpen(isOpen) {
    if (!yearDropdown || !yearBtn) return;

    yearDropdown.classList.toggle('open', isOpen);
    yearBtn.classList.toggle('open', isOpen);

    // CSS'te scaleY(1) yok; HTML/CSS'e dokunmadan inline ile çözüyoruz
    yearDropdown.style.transform = isOpen ? 'scaleY(1)' : 'scaleY(0)';
    yearDropdown.style.opacity = isOpen ? '1' : '0';
    yearDropdown.style.pointerEvents = isOpen ? 'auto' : 'none';

    const chevron = yearBtn.querySelector('.icon-chevron');
    if (chevron)
      chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  }

  if (yearBtn && yearDropdown) {
    yearBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = !yearDropdown.classList.contains('open');
      setDropdownOpen(isOpen);
    });

    yearDropdown.addEventListener('click', e => {
      e.stopPropagation();
      if (e.target.tagName === 'LI') {
        selectedYearValue = e.target.dataset.year || '';
        selectedYear.textContent = e.target.textContent;

        setDropdownOpen(false);
      }
    });
  }

  document.addEventListener('click', e => {
    if (!yearDropdown || !yearBtn) return;
    if (!yearDropdown.classList.contains('open')) return;

    if (!yearDropdown.contains(e.target) && !yearBtn.contains(e.target)) {
      setDropdownOpen(false);
    }
  });

  // ======================
  // SEARCH
  // ======================
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      currentQuery = filmInput.value.trim();
      hasSearched = true;
      currentPage = 1;

      if (!currentQuery && !selectedYearValue) {
        hasSearched = false;
        fetchTrending(1);
        return;
      }

      searchMovies(1);
    });
  }

  // ======================
  // FULL CLEAR (opsiyonel buton)
  // Not: HTML'de clearSearch id yok, o yüzden clearBtnSafe kullanılıyor
  // ======================
  if (clearBtnSafe) {
    clearBtnSafe.addEventListener('click', function () {
      filmInput.value = '';
      if (clearInputBtn) clearInputBtn.style.display = 'none';

      if (selectedYear) selectedYear.textContent = 'Year';

      currentQuery = '';
      selectedYearValue = '';
      hasSearched = false;
      currentPage = 1;

      fetchTrending(1);
    });
  }

  // ======================
  // SEARCH LOGIC
  // ======================
  function searchMovies(page = 1) {
    let url = '';

    currentMode = 'search';
    currentPage = page;

    if (currentQuery) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        currentQuery
      )}&page=${page}`;

      if (selectedYearValue) {
        url += `&year=${selectedYearValue}`;
      }
    } else {
      // sadece yıl seçildi ama arama yoksa discover ile filtrele
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`;

      if (selectedYearValue) {
        url += `&primary_release_year=${selectedYearValue}`;
      }
    }

    fetch(url)
      .then(r => r.json())
      .then(d => {
        renderMovies(d.results || []);
        setupPagination(d.total_results || 0, page);
      })
      .catch(err => console.error('searchMovies error:', err));
  }

  // ======================
  // TRENDING
  // ======================
  fetchTrending(1);

  function fetchTrending(page = 1) {
    emptyMessage.style.display = 'none';
    currentMode = 'trending';
    currentPage = page;

    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`)
      .then(r => r.json())
      .then(d => {
        renderMovies(d.results || []);
        setupPagination(d.total_results || 0, page);
      })
      .catch(err => console.error('fetchTrending error:', err));
  }

  // ======================
  // RENDER
  // ======================
  function renderMovies(movies) {
    moviesContainer.innerHTML = '';

    if (!movies.length) {
      emptyMessage.style.display = hasSearched ? 'block' : 'none';
      return;
    }

    emptyMessage.style.display = 'none';

    movies.slice(0, 20).forEach(movie => {
      const card = document.createElement('a');
      card.className = 'movie-card';
      card.setAttribute('data-id', movie.id);
      card.setAttribute('data-movie-id', movie.id);
      card.href = `catalog.html?id=${movie.id}`;

      const poster = movie.poster_path
        ? `${IMAGE_BASE}${movie.poster_path}`
        : 'https://placehold.co/600x400';

      const year = movie.release_date?.slice(0, 4) || 'N/A';
      const genres =
        movie.genre_ids
          ?.map(id => genreMap[id])
          .filter(Boolean)
          .slice(0, 2)
          .join(', ') || 'Unknown';

      card.innerHTML = `
        <img src="${poster}" alt="${movie.title || 'Movie'}">
        <div class="movie-card-overlay">
          <div class="movie-card-text">
            <h3>${movie.title || 'Untitled'}</h3>
            <div class="movie-meta">
              <span class="movie-genre">${genres}</span>
              <span class="movie-year">| ${year}</span>
            </div>
          </div>
          <div class="movie-rating-stars"></div>
        </div>
      `;

      card.addEventListener('click', e => {
        e.preventDefault(); // linke gitmeyi engelle
        e.stopPropagation();

        const movieId = card.dataset.movieId; // data-movie-id'den gelir
        openPopupSafe(movieId);
      });

      moviesContainer.appendChild(card);

      renderStarsToRating(
        card.querySelector('.movie-rating-stars'),
        movie.vote_average
      );
    });
  }
}

function renderStarsToRating(el, rating) {
  if (!el) return;
  el.innerHTML = '';

  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = rating % 2 >= 1;

  for (let i = 0; i < 5; i++) {
    let fillType = 'empty';
    if (i < fullStars) fillType = 'full';
    else if (i === fullStars && hasHalfStar) fillType = 'half';

    const gid = `star-${Math.random().toString(36).slice(2)}`;

    el.innerHTML += `
        <svg viewBox="0 0 32 32" width="14" height="14">
        <defs>
          <linearGradient id="${gid}-full" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#F84119"/>
            <stop offset="100%" stop-color="#F89F19"/>
          </linearGradient>
          <linearGradient id="${gid}-half" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#F84119"/>
            <stop offset="50%" stop-color="#F89F19"/>
            <stop offset="50%" stop-color="#bfbfbf"/>
            <stop offset="100%" stop-color="#bfbfbf"/>
          </linearGradient>
        </defs>
        <path
          d="M24.622 30L16 24.173 7.378 30l3.135-9.286L2.388 15.14h10.024L16 5.827l3.588 9.313h10.024l-8.125 5.569z"
          fill="${
            fillType === 'full'
              ? `url(#${gid}-full)`
              : fillType === 'half'
                ? `url(#${gid}-half)`
                : '#bfbfbf'
          }"
        />
      </svg>
        `;
  }
}

// ======================
// POPUP HOOK (safe)
// ======================

const openPopupSafe = movieId => {
  // popup global olarak window'a eklenmiş olabilir
  if (typeof window.openMoviePopup === 'function') {
    window.openMoviePopup(movieId);
    return true;
  }

  // popup export ile gelirse (opsiyonel)
  if (typeof openMoviePopup === 'function') {
    openMoviePopup(movieId);
    return true;
  }

  console.warn(
    'openMoviePopup bulunamadı. Popup modülü sayfaya yüklenmemiş olabilir.'
  );
  return false;
};
