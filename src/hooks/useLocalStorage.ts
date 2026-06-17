import { useState, useEffect, useCallback } from 'react';

/**
 * Generyczny hook utrwalający stan w localStorage. Używany m.in. dla
 * ustawień prywatności i preferencji powiadomień, aby przetrwały odświeżenie.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* zapis może się nie powieść (np. tryb prywatny) — ignorujemy */
    }
  }, [key, value]);

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValue, remove] as const;
}
