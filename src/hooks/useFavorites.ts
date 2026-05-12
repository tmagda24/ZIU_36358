import { useState, useCallback, useEffect } from 'react';
import type { Movie } from './useFetchMovies';

const STORAGE_KEY = 'movie-browser-favorites';

function loadFavorites(): Movie[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>(loadFavorites);

  // Nasłuchiwanie na globalne zdarzenie, by synchronizować wszystkie karty
  useEffect(() => {
    const handleStorageChange = () => {
      setFavorites(loadFavorites());
    };

    window.addEventListener('favorites-updated', handleStorageChange);
    return () => window.removeEventListener('favorites-updated', handleStorageChange);
  }, []);

  const toggleFavorite = useCallback(async (movie: Movie) => {
    // 1. Zawsze pobieraj NAJŚWIEŻSZY stan prosto z localStorage
    const currentFavorites = loadFavorites();
    
    // 2. Dodaj lub usuń film z najświeższej listy
    const next = currentFavorites.some((m) => m.id === movie.id)
      ? currentFavorites.filter((m) => m.id !== movie.id)
      : [...currentFavorites, movie];
      
    // 3. Zapisz zaktualizowaną listę
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    
    // 4. Wyślij globalne zdarzenie, żeby inne komponenty (karty) zaktualizowały swój stan
    window.dispatchEvent(new Event('favorites-updated'));
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}