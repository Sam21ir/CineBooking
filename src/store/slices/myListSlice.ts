import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from './moviesSlice';

interface MyListState {
  movies: Movie[];
}

// Load from localStorage on init
const loadFromLocalStorage = (): Movie[] => {
  try {
    const item = localStorage.getItem('myList');
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

const initialState: MyListState = {
  movies: loadFromLocalStorage(),
};

const myListSlice = createSlice({
  name: 'myList',
  initialState,
  reducers: {
    addToMyList: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      if (!state.movies.find(m => m.id === movie.id)) {
        state.movies.push(movie);
        localStorage.setItem('myList', JSON.stringify(state.movies));
      }
    },
    removeFromMyList: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter(m => m.id !== action.payload);
      localStorage.setItem('myList', JSON.stringify(state.movies));
    },
    toggleMyList: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      const index = state.movies.findIndex(m => m.id === movie.id);
      if (index >= 0) {
        state.movies.splice(index, 1);
      } else {
        state.movies.push(movie);
      }
      localStorage.setItem('myList', JSON.stringify(state.movies));
    },
    clearMyList: (state) => {
      state.movies = [];
      localStorage.removeItem('myList');
    },
  },
});

export const { addToMyList, removeFromMyList, toggleMyList, clearMyList } = myListSlice.actions;
export default myListSlice.reducer;

