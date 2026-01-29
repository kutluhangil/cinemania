console.log("weekly-trends.js yüklendi");

const API_KEY = '9431d01d3d7808621793b8bdf7ec9167';
const movieGrid = document.getElementById('movie-grid');

async function fetchTrends() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
        const data = await response.json();
        displayMovies(data.results.slice(0, 3)); // İlk 3 filmi göster
    } catch (error) {
        console.error("Veri çekilemedi:", error);
    }
}

function displayMovies(movies) {
    movieGrid.innerHTML = movies.map(movie => `
        <div class="movie-card">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-meta">Drama, Action | ${movie.release_date.split('-')[0]}</div>
                <div class="stars">★★★★★</div>
            </div>
        </div>
    `).join('');
}

fetchTrends();