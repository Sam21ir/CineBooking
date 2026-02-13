import { GoogleGenerativeAI } from '@google/generative-ai';
import { Movie } from '../store/slices/moviesSlice';

// Get API key from environment (Vite uses import.meta.env)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini client 
const genAI = (API_KEY && API_KEY.trim() && API_KEY !== 'your-api-key-here') 
  ? new GoogleGenerativeAI(API_KEY)
  : null;

/** 
 * FIXED: Changed from 'gemini-pro' to 'gemini-1.5-flash'
 * gemini-1.5-flash is faster, more reliable, and has a generous free tier.
 */
const MODEL_NAME = 'gemini-1.5-flash';

export function isAIAvailable(): boolean {
  return genAI !== null;
}

export interface AIRecommendationRequest {
  movies: Movie[];
  userPreferences?: {
    favoriteGenres?: string[];
    favoriteMovies?: string[];
  };
}

export interface AISimilarMoviesRequest {
  movie: Movie;
  allMovies: Movie[];
}

/**
 * Helper to clean AI response (removes markdown backticks if AI adds them)
 */
const cleanJsonReadyText = (text: string) => {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export async function getPersonalizedRecommendations(
  request: AIRecommendationRequest
): Promise<Movie[]> {
  if (!isAIAvailable() || !genAI) {
    return request.movies.sort((a, b) => b.rating - a.rating).slice(0, 5);
  }

  try {
    const { movies, userPreferences } = request;
    const moviesList = movies.map(m => ({
      title: m.title,
      genre: m.genre,
      rating: m.rating,
      synopsis: m.synopsis.substring(0, 150),
    })).slice(0, 20);

    const prompt = `You are a movie recommendation expert. Based on the available movies below and user preferences, recommend 5 movies.
    
    Available Movies: ${JSON.stringify(moviesList)}
    User Genres: ${userPreferences?.favoriteGenres?.join(', ') || 'Any'}
    
    Return ONLY a raw JSON array of titles. Example: ["Movie A", "Movie B"]`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const text = cleanJsonReadyText(result.response.text());

    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const titles = JSON.parse(jsonMatch[0]) as string[];
      return titles.map(t => movies.find(m => m.title === t)).filter((m): m is Movie => !!m);
    }
    throw new Error("Invalid JSON format");
  } catch (error) {
    console.error('AI Error:', error);
    return request.movies.slice(0, 5);
  }
}

export async function getSimilarMovies(request: AISimilarMoviesRequest): Promise<Movie[]> {
  if (!isAIAvailable() || !genAI) {
    return request.allMovies.filter(m => m.genre === request.movie.genre).slice(0, 5);
  }

  try {
    const { movie, allMovies } = request;
    const otherMovies = allMovies.filter(m => m.id !== movie.id).slice(0, 15);

    const prompt = `Find 5 movies similar to "${movie.title}" (${movie.genre}). 
    Available list: ${JSON.stringify(otherMovies.map(m => m.title))}
    Return ONLY a JSON array of titles.`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const text = cleanJsonReadyText(result.response.text());

    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const titles = JSON.parse(jsonMatch[0]) as string[];
      return titles.map(t => allMovies.find(m => m.title === t)).filter((m): m is Movie => !!m);
    }
    return [];
  } catch (error) {
    return [];
  }
}

export async function generateAISynopsis(movie: Movie): Promise<string> {
  if (!isAIAvailable() || !genAI) return movie.synopsis;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `Rewrite this movie synopsis to be more exciting for a cinema website in 2 sentences: ${movie.synopsis}`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return movie.synopsis;
  }
}

export async function getTrendingMovies(movies: Movie[]): Promise<Movie[]> {
    // Basic fallback logic
    if (!isAIAvailable() || !genAI) {
        return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5);
    }
    
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const prompt = `Identify the 5 most "trending" looking movies from this list: ${JSON.stringify(movies.map(m => m.title))}. Return ONLY a JSON array of titles.`;
        const result = await model.generateContent(prompt);
        const text = cleanJsonReadyText(result.response.text());
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
            const titles = JSON.parse(jsonMatch[0]) as string[];
            return titles.map(t => movies.find(m => m.title === t)).filter((m): m is Movie => !!m);
        }
        return movies.slice(0, 5);
    } catch (e) {
        return movies.slice(0, 5);
    }
}