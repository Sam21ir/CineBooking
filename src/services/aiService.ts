import { GoogleGenerativeAI } from '@google/generative-ai';
import { Movie } from '../store/slices/moviesSlice';

// Get API key from environment (Vite uses import.meta.env)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini client 
const genAI = (API_KEY && API_KEY.trim() && API_KEY !== 'your-api-key-here') 
  ? new GoogleGenerativeAI(API_KEY)
  : null;

/** 
 * Using 'gemini-1.5-flash' - faster, more reliable, and has a generous free tier.
 * Alternative: 'gemini-pro' for better quality (slower, more expensive)
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
    console.log('🤖 AI not available, using fallback recommendations');
    // Shuffle and return varied recommendations
    const shuffled = [...request.movies].sort(() => Math.random() - 0.5);
    return shuffled
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }

  try {
    const { movies, userPreferences } = request;
    // Shuffle movies to get different results each time
    const shuffled = [...movies].sort(() => Math.random() - 0.5);
    const moviesList = shuffled.map(m => ({
      title: m.title,
      genre: m.genre,
      rating: m.rating,
      synopsis: m.synopsis.substring(0, 150),
    })).slice(0, 20);

    console.log('🤖 Calling AI for personalized recommendations...');
    const prompt = `You are a movie recommendation expert. Based on the available movies below and user preferences, recommend 5 DIFFERENT movies that the user would enjoy. Try to vary the genres and ratings.

Available Movies: ${JSON.stringify(moviesList)}
User Genres: ${userPreferences?.favoriteGenres?.join(', ') || 'Any'}
User Favorite Movies: ${userPreferences?.favoriteMovies?.join(', ') || 'None'}

IMPORTANT: Return 5 DIFFERENT movies, not just the highest rated ones. Consider variety in genres and ratings.
Return ONLY a raw JSON array of titles. Example: ["Movie A", "Movie B", "Movie C", "Movie D", "Movie E"]`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const text = cleanJsonReadyText(result.response.text());
    console.log('🤖 AI Response:', text);

    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const titles = JSON.parse(jsonMatch[0]) as string[];
      const recommended = titles.map(t => movies.find(m => m.title === t)).filter((m): m is Movie => !!m);
      console.log('🤖 Recommended movies:', recommended.map(m => m.title));
      return recommended;
    }
    throw new Error("Invalid JSON format");
  } catch (error) {
    console.error('🤖 AI Error:', error);
    // Fallback with shuffle for variety
    const shuffled = [...request.movies].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
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
        console.log('🤖 AI not available, using fallback trending movies');
        // Shuffle and return varied trending movies
        const shuffled = [...movies].sort(() => Math.random() - 0.5);
        return shuffled
          .sort((a, b) => {
            // Consider both rating and recency
            const ratingDiff = b.rating - a.rating;
            const dateA = new Date(a.releaseDate).getTime();
            const dateB = new Date(b.releaseDate).getTime();
            const recencyDiff = dateB - dateA;
            return ratingDiff * 0.7 + (recencyDiff / 10000000000) * 0.3;
          })
          .slice(0, 5);
    }
    
    try {
        console.log('🤖 Calling AI for trending movies...');
        // Shuffle movies to get different results each time
        const shuffled = [...movies].sort(() => Math.random() - 0.5);
        const moviesData = shuffled.map(m => ({
          title: m.title,
          genre: m.genre,
          rating: m.rating,
          releaseDate: m.releaseDate,
        })).slice(0, 20);
        
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const prompt = `Identify the 5 most "trending" movies from this list. Consider:
- High ratings (but not necessarily the highest)
- Recent release dates
- Popular genres
- Overall appeal

Movies: ${JSON.stringify(moviesData)}

IMPORTANT: Return 5 DIFFERENT trending movies, not just the highest rated. Consider variety.
Return ONLY a JSON array of titles. Example: ["Movie A", "Movie B", "Movie C", "Movie D", "Movie E"]`;
        
        const result = await model.generateContent(prompt);
        const text = cleanJsonReadyText(result.response.text());
        console.log('🤖 AI Response:', text);
        
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
            const titles = JSON.parse(jsonMatch[0]) as string[];
            const trending = titles.map(t => movies.find(m => m.title === t)).filter((m): m is Movie => !!m);
            console.log('🤖 Trending movies:', trending.map(m => m.title));
            return trending;
        }
        // Fallback with shuffle
        const shuffledFallback = [...movies].sort(() => Math.random() - 0.5);
        return shuffledFallback.slice(0, 5);
    } catch (e) {
        console.error('🤖 AI Error:', e);
        // Fallback with shuffle
        const shuffled = [...movies].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 5);
    }
}