// src/js/api/movies-api.js
const API_KEY = '6e2b9ceff6313b472d60eed2769db38a'; // benim anahtar
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Haftalık trend olan filmleri getirir.
 */
export async function getWeeklyTrending() {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    if (!response.ok) throw new Error('Veri çekilemedi!');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Hata:", error);
    return [];
  }
}

/**
 * Film adına göre arama yapar (Katalog sayfası için).
 * @param {string} query - Aranan film adı
 * @param {number} page - Sayfa numarası
 */
export async function searchMovies(query, page = 1) {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`);
    if (!response.ok) throw new Error('Arama yapılamadı!');
    return await response.json();
  } catch (error) {
    console.error("Arama Hatası:", error);
    return null;
  }
}

/**
 * Filmin detaylı bilgilerini getirir (Modal veya detay sayfası için).
 */
export async function getMovieDetails(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error("Detay Hatası:", error);
  }
}