interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div className="error-banner">
      <p>Wystąpił błąd: {message}</p>
      <button onClick={onRetry}>Spróbuj ponownie</button>
    </div>
  );
}