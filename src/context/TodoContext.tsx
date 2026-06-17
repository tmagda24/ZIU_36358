import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { TodoState, Todo } from '../types/todo.types';
import { todoReducer, initialTodoState } from '../reducers/todoReducer';
import { todoApi } from '../api/todoApi';

interface TodoContextType {
  state: TodoState;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

function getErrorMessage(err: unknown): string {
  if (err instanceof TypeError) {
    return 'Brak połączenia z serwerem. Sprawdź połączenie internetowe i spróbuj ponownie.';
  }
  return err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd.';
}

/**
 * Globalny stan zadań (Context API + useReducer) z obsługą stanów
 * asynchronicznych: loading · success · error. Każda mutacja najpierw
 * wysyła żądanie do API, a następnie aktualizuje stan lokalny.
 */
export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const fetchTodos = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const todos = await todoApi.list();
      dispatch({ type: 'FETCH_SUCCESS', payload: todos });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: getErrorMessage(err) });
    }
  }, []);

  const addTodo = useCallback(async (title: string) => {
    try {
      const created = await todoApi.create(title);
      dispatch({ type: 'ADD', payload: created });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(err) });
      throw err;
    }
  }, []);

  const toggleTodo = useCallback(
    async (id: string) => {
      const target = state.todos.find((t) => t.id === id);
      if (!target) return;
      // Optymistyczna aktualizacja UI.
      dispatch({ type: 'TOGGLE', payload: id });
      try {
        await todoApi.update({ ...target, completed: !target.completed });
      } catch (err) {
        // Wycofanie zmiany w razie błędu sieci.
        dispatch({ type: 'TOGGLE', payload: id });
        dispatch({ type: 'SET_ERROR', payload: getErrorMessage(err) });
      }
    },
    [state.todos]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      const snapshot = state.todos;
      dispatch({ type: 'DELETE', payload: id });
      try {
        await todoApi.remove(id);
      } catch (err) {
        dispatch({ type: 'FETCH_SUCCESS', payload: snapshot });
        dispatch({ type: 'SET_ERROR', payload: getErrorMessage(err) });
      }
    },
    [state.todos]
  );

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const value = useMemo(
    () => ({ state, fetchTodos, addTodo, toggleTodo, deleteTodo }),
    [state, fetchTodos, addTodo, toggleTodo, deleteTodo]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext musi być użyty wewnątrz TodoProvider');
  }
  return context;
}

export type { Todo };
