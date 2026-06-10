import { useCallback } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import type { Movie } from '../hooks/useFetchMovies';

const IMG_BASE = 'https://image.tmdb.org/t/p/w200';

interface Props {
  movie: Movie;
}

export function FavoriteCard({ movie }: Props) {
  const { toggleFavorite } = useFavorites();

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(movie);
    
    // Wywołanie powiadomienia Toast
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message: `Usunięto z ulubionych: ${movie.title}` }
    }));
  }, [toggleFavorite, movie]);

  const imageSrc = movie.poster_path 
    ? `${IMG_BASE}${movie.poster_path}` 
    : 'https://placehold.co/100x150/1e293b/475569?text=Brak';

  return (
    <div className="favorite-card">
      <div className="drag-handle" aria-hidden="true">☰</div>
      <img src={imageSrc} alt={movie.title} className="fav-poster" />
      <div className="fav-info">
        <h3>{movie.title}</h3>
        <p className="fav-meta">
          <span className="year">{movie.release_date?.slice(0, 4) || 'Brak daty'}</span>
          <span className="rating">⭐ {movie.vote_average?.toFixed(1) || '0.0'}</span>
        </p>
      </div>
      <button onClick={handleRemove} className="fav-remove-btn" aria-label="Usuń z ulubionych">
        ❌
      </button>
    </div>
  );
}