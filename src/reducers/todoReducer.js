export const initialTodoState = {
    todos: [],
    status: 'idle',
    error: null,
};
export function todoReducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, status: 'loading', error: null };
        case 'FETCH_SUCCESS':
            return { ...state, status: 'success', error: null, todos: action.payload };
        case 'FETCH_ERROR':
            return { ...state, status: 'error', error: action.payload };
        case 'ADD':
            return { ...state, todos: [action.payload, ...state.todos] };
        case 'TOGGLE':
            return {
                ...state,
                todos: state.todos.map((t) => t.id === action.payload ? { ...t, completed: !t.completed } : t),
            };
        case 'DELETE':
            return { ...state, todos: state.todos.filter((t) => t.id !== action.payload) };
        case 'EDIT':
            return {
                ...state,
                todos: state.todos.map((t) => t.id === action.payload.id ? { ...t, title: action.payload.title } : t),
            };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}
