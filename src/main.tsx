import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeModeProvider } from './context/ThemeModeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { TodoProvider } from './context/TodoContext';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <AuthProvider>
        <NotificationsProvider>
          <TodoProvider>
            {/* HashRouter — bezproblemowe wdrożenie na GitHub Pages / Netlify / Vercel bez konfiguracji serwera. */}
            <HashRouter>
              <App />
            </HashRouter>
          </TodoProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeModeProvider>
  </React.StrictMode>
);
