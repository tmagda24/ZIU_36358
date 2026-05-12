import { useState } from 'react';
import { useFetchMovies } from './hooks/useFetchMovies';
import { useDebounce } from './hooks/useDebounce';
import { MovieCard } from './components/MovieCard';
import { SkeletonCard } from './components/SkeletonCard';
import { ErrorBanner } from './components/ErrorBanner';
import { EmptyState } from './components/EmptyState';
import { MovieModal } from './components/MovieModal';
import './index.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // Debouncing dla wyszukiwarki - ogranicza liczbę zapytań
  const debouncedQuery = useDebounce(query, 300);
  
  // Pobieranie danych z użyciem React Query
  const { data, isLoading, isError, error, refetch, isPlaceholderData } = useFetchMovies(page, debouncedQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1); // Reset strony przy nowym wyszukiwaniu
  };

  return (
    <div className="app-container">
      <header>
        <h1>Movie Browser 🍿</h1>
        <input
          type="text"
          placeholder="Szukaj filmów..."
          value={query}
          onChange={handleSearchChange}
          className="search-input"
        />
      </header>

      <main>
        {/* Stan: Błąd zapytania */}
        {isError && <ErrorBanner message={error.message} onRetry={refetch} />}
        
        {/* Stan: Pusty wynik (bezpieczne sprawdzanie za pomocą '?') */}
        {data?.results?.length === 0 && !isLoading && !isError && <EmptyState />}

        {/* Siatka z filmami lub Skeleton Loaderami */}
        <div className={`movie-grid ${isPlaceholderData ? 'loading-opacity' : ''}`}>
          {isLoading ? (
            Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            data?.results?.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onClick={(id) => setSelectedMovieId(id)} 
              />
            ))
          )}
        </div>

        {/* Paginacja */}
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
      </main>

      {/* Modal ze szczegółami filmu */}
      <MovieModal id={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
    </div>
  );
}