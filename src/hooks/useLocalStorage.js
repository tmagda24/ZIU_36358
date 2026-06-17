import { useState, useEffect, useCallback } from 'react';
/**
 * Generyczny hook utrwalający stan w localStorage. Używany m.in. dla
 * ustawień prywatności i preferencji powiadomień, aby przetrwały odświeżenie.
 */
export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : initialValue;
        }
        catch {
            return initialValue;
        }
    });
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
        catch {
            /* zapis może się nie powieść (np. tryb prywatny) — ignorujemy */
        }
    }, [key, value]);
    const remove = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
        }
        catch {
            /* ignore */
        }
        setValue(initialValue);
    }, [key, initialValue]);
    return [value, setValue, remove];
}
