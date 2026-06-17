export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';

/** Status operacji asynchronicznych (loading · success · error). */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface TodoState {
  todos: Todo[];
  status: RequestStatus;
  error: string | null;
}

export type TodoAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Todo[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD'; payload: Todo }
  | { type: 'TOGGLE'; payload: string }
  | { type: 'DELETE'; payload: string }
  | { type: 'EDIT'; payload: { id: string; title: string } }
  | { type: 'SET_ERROR'; payload: string | null };
