import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HomePage } from './pages/HomePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ToastContainer } from './components/ToastContainer';
import { usePageTracking } from './hooks/usePageTracking';
import './index.css';

// Definicja animacji dla widoków (Page Transitions)
const pageVariants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, x: 16,  transition: { duration: 0.18, ease: 'easeIn' } },
};

export interface ToastMessage {
  id: number;
  message: string;
}

export default function App() {
  const location = useLocation();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ZADANIE A — analityka: śledzenie odsłon na wszystkich trasach (SPA).
  usePageTracking();

  // Nasłuchiwanie na globalne zdarzenia Toast z dowolnego miejsca w aplikacji
  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: customEvent.detail.message }]);
      
      // Auto-ukrywanie po 3 sekundach
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  return (
    <div className="app-container">
      <header>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>Movie Browser 🍿</h1>
        </Link>
        <nav className="main-nav">
          <Link to="/" className="nav-link">Główna</Link>
          <Link to="/favorites" className="nav-link">Ulubione</Link>
        </nav>
      </header>

      <main>
        {/* AnimatePresence dla płynnego przełączania podstron */}
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route 
              path='/' 
              element={
                <motion.div variants={pageVariants} initial='initial' animate='animate' exit='exit'>
                  <HomePage />
                </motion.div>
              } 
            />
            <Route 
              path='/favorites' 
              element={
                <motion.div variants={pageVariants} initial='initial' animate='animate' exit='exit'>
                  <FavoritesPage />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Kontener powiadomień na dole ekranu */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}