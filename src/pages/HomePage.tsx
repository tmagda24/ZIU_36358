import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFetchMovies } from '../hooks/useFetchMovies';
import { useDebounce } from '../hooks/useDebounce';
import { trackEvent } from '../analytics';
import { MovieCard } from '../components/MovieCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { ErrorBanner } from '../components/ErrorBanner';
import { EmptyState } from '../components/EmptyState';
import { MovieModal } from '../components/MovieModal';

// Variants dla kontenera listy (efekt stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export function HomePage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading, isError, error, refetch, isPlaceholderData } = useFetchMovies(page, debouncedQuery);

  // ZADANIE A — śledzenie „formularza" wyszukiwania.
  // Pole wyszukiwania pełni rolę interaktywnego formularza, dla którego mierzymy
  // zarówno udany „submit", jak i porzucenie (drop-off).
  const hasTyped = useRef(false);     // czy użytkownik zaczął wpisywać frazę
  const hasConverted = useRef(false); // czy otworzył jakikolwiek wynik (film)

  // Zdarzenie niestandardowe #2: „Search Submit".
  // Wpisanie frazy i uzyskanie wyników traktujemy jak submit formularza.
  // RODO (minimalizacja): wysyłamy WYŁĄCZNIE długość zapytania (bucket) oraz
  // liczbę wyników. NIE wysyłamy treści frazy (mogłaby zawierać dane wrażliwe).
  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    trackEvent('Search Submit', {
      query_length: debouncedQuery.trim().length,
      results_count: data?.results?.length ?? 0,
    });
  }, [debouncedQuery, data?.results?.length]);

  // Zdarzenie niestandardowe #3: „Form Abandon".
  // Porzucenie: użytkownik zaczął pisać, ale opuścił widok (unmount)
  // bez otwarcia żadnego wyniku (brak konwersji).
  // RODO (minimalizacja): wysyłamy tylko etap porzucenia, bez żadnej treści.
  useEffect(() => {
    return () => {
      if (hasTyped.current && !hasConverted.current) {
        trackEvent('Form Abandon', { stage: 'search' });
      }
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim()) hasTyped.current = true;
    setQuery(value);
    setPage(1);
  };

  const handleSelectMovie = (id: number) => {
    hasConverted.current = true;
    setSelectedMovieId(id);
  };

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Szukaj filmów..."
          value={query}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {isError && <ErrorBanner message={error.message} onRetry={refetch} />}
      {data?.results?.length === 0 && !isLoading && !isError && <EmptyState />}

      <motion.div 
        className={`movie-grid ${isPlaceholderData ? 'loading-opacity' : ''}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          data?.results?.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={handleSelectMovie} 
            />
          ))
        )}
      </motion.div>

      {data && data.total_pages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Poprzednia
          </button>
          <span>Strona {page} z {data.total_pages}</span>
          <button disabled={page >= data.total_pages} onClick={() => setPage((p) => p + 1)}>
            Następna
          </button>
        </div>
      )}

      <MovieModal id={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
    </>
  );
}