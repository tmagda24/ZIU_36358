import { useMovieDetails } from '../hooks/useMovieDetails';

interface Props {
  id: number | null;
  onClose: () => void;
}

export function MovieModal({ id, onClose }: Props) {
  const { data, isLoading, isError } = useMovieDetails(id);

  if (!id) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        {isLoading && <p>Ładowanie szczegółów...</p>}
        {isError && <p>Nie udało się pobrać szczegółów.</p>}
        {data && (
          <>
            <h2>{data.title}</h2>
            <p><strong>Opis:</strong> {data.overview}</p>
            <p><strong>Budżet:</strong> {data.budget} $</p>
            <p><strong>Czas trwania:</strong> {data.runtime} min</p>
          </>
        )}
      </div>
    </div>
  );
}