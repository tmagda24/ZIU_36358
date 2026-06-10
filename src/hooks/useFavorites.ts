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

  useEffect(() => {
    const handleStorageChange = () => {
      setFavorites(loadFavorites());
    };

    window.addEventListener('favorites-updated', handleStorageChange);
    return () => window.removeEventListener('favorites-updated', handleStorageChange);
  }, []);

  const toggleFavorite = useCallback(async (movie: Movie) => {
    const currentFavorites = loadFavorites();
    const next = currentFavorites.some((m) => m.id === movie.id)
      ? currentFavorites.filter((m) => m.id !== movie.id)
      : [...currentFavorites, movie];
      
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('favorites-updated'));
  }, []);

  // Nowa funkcja zapisująca posortowaną listę dla Drag & Drop
  const reorderFavorites = useCallback((newOrder: Movie[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
    setFavorites(newOrder); // Aktualizacja lokalnego stanu natychmiast dla Reorder.Group
    window.dispatchEvent(new Event('favorites-updated'));
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, reorderFavorites };
}