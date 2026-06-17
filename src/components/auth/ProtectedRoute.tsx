import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Strażnik tras — przekierowuje niezalogowanych użytkowników do logowania,
 * zapamiętując ścieżkę, z której przyszli (powrót po zalogowaniu).
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/logowanie" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
