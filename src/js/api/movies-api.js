// js/api/movies-api.js

export const API_KEY = '6e2b9ceff6313b472d60eed2769db38a'; // API key anahtarım artık burada
export const BASE_URL = 'https://api.themoviedb.org/3';
export const BASE_IMAGE = "https://image.tmdb.org/t/p/w500";
/**
 * Haftalık trend olan filmleri getirir.
 */
export async function getWeeklyTrending() {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    if (!response.ok) throw new Error('Veri çekilemedi!');
    const data = await response.json();
    return data.results; // 20 film döner
  } catch (error) {
    console.error("Hata:", error);
    return [];
  }
}