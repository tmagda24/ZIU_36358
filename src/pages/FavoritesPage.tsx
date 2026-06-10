import { Reorder } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import { FavoriteCard } from '../components/FavoriteCard';

export function FavoritesPage() {
  const { favorites, reorderFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="empty-state">
        <h2>Brak ulubionych filmów</h2>
        <p>Dodaj coś do ulubionych, aby zobaczyć to tutaj.</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
        Przeciągnij elementy pionowo ☰, aby zmienić ich kolejność
      </h2>
      
      {/* Lista Drag & Drop działająca w osi Y */}
      <Reorder.Group 
        axis="y" 
        values={favorites} 
        onReorder={reorderFavorites}
        className="favorites-list"
      >
        {favorites.map((movie) => (
          <Reorder.Item 
            key={movie.id} 
            value={movie} 
            className="reorder-item"
          >
            <FavoriteCard movie={movie} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}