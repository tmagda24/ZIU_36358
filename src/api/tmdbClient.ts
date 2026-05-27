import axios from 'axios';

export const tmdbClient = axios.create({
  // Zapasowy URL zapobiegnie wysyłaniu zapytań na localhost, gdy brakuje pliku .env
  baseURL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  params: {
    // Zapasowy klucz, żeby zapytania nie "wywalały" błędów o brakującym parametrze
    api_key: import.meta.env.VITE_TMDB_API_KEY || 'brak_klucza_api',
    language: 'pl-PL',
  },
});