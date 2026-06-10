import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from '../analytics';

/**
 * Śledzenie odsłon (pageviews) dla aplikacji SPA.
 *
 * W aplikacji jednostronicowej przeglądarka nie przeładowuje dokumentu przy
 * zmianie trasy, dlatego nasłuchujemy na zmianę `location` z React Routera
 * i ręcznie raportujemy odsłonę. Dzięki temu raportowane są WSZYSTKIE trasy
 * projektu (/ oraz /favorites).
 *
 * RODO: rejestrujemy wyłącznie ścieżkę URL (np. "/favorites") — bez żadnych
 * danych osobowych ani identyfikatorów użytkownika.
 */
export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    trackPageview();
  }, [location.pathname]);
}
