import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import type { Movie } from '../hooks/useFetchMovies';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface Props { 
  movie: Movie; 
  onClick?: (id: number) => void;
}

export function MovieCard({ movie, onClick }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);
  
  // Weryfikacja preferencji użytkownika odnośnie animacji (opt-out)
  const shouldReduce = useReducedMotion();

  const displayedFav = optimisticFav ?? isFavorite(movie.id);

  const handleToggle = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setOptimisticFav(!displayedFav);
    try {
      await toggleFavorite(movie);
      
      // Wywołanie powiadomienia Toast
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message: !displayedFav ? `Dodano: ${movie.title}` : `Usunięto: ${movie.title}` }
      }));

      setOptimisticFav(null);
    } catch {
      setOptimisticFav(null);
    }
  }, [displayedFav, toggleFavorite, movie]);

  const imageSrc = movie.poster_path 
    ? `${IMG_BASE}${movie.poster_path}` 
    : 'https://placehold.co/500x750/1e293b/475569?text=Brak\nplakatu';

  // Warianty dla elementu listy ze staggerem
  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <motion.div 
      className='movie-card card' 
      onClick={() => onClick && onClick(movie.id)}
      variants={itemVariants}
      // Nie podajemy initial/animate, bo dziedziczą one stany z kontenera "HomePage"
    >
      <div className="movie-poster-container">
        <img src={imageSrc} alt={movie.title} loading="lazy" />
        <button
          onClick={handleToggle}
          aria-label={displayedFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          className={`fav-btn ${displayedFav ? 'active' : ''}`}
        >
          {displayedFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-meta">
          <span className="year">{movie.release_date?.slice(0, 4) || 'Brak daty'}</span>
          <span className="rating">⭐ {movie.vote_average?.toFixed(1) || '0.0'}</span>
        </p>
      </div>
    </motion.div>
  );
}