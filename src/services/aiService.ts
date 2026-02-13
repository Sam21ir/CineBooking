import Anthropic from '@anthropic-ai/sdk';
import { Movie } from '../store/slices/moviesSlice';

// Initialize Anthropic client
// ⚠️ WARNING: Using API key in browser is a security risk!
// For production, create a backend API endpoint instead.
// In production, store API key in environment variable
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true, // Required for browser usage, but exposes API key
});

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
 * Generate personalized movie recommendations using Claude AI
 */
export async function getPersonalizedRecommendations(
  request: AIRecommendationRequest
): Promise<Movie[]> {
  try {
    const { movies, userPreferences } = request;
    
    const moviesList = movies.map(m => ({
      title: m.title,
      genre: m.genre,
      rating: m.rating,
      synopsis: m.synopsis.substring(0, 200), // Truncate for token efficiency
    })).slice(0, 20); // Limit to 20 movies for API efficiency

    const prompt = `You are a movie recommendation expert. Based on the following list of movies and user preferences, recommend 5 movies that the user would enjoy.

Available Movies:
${JSON.stringify(moviesList, null, 2)}

${userPreferences?.favoriteGenres ? `User's Favorite Genres: ${userPreferences.favoriteGenres.join(', ')}` : ''}
${userPreferences?.favoriteMovies ? `User's Favorite Movies: ${userPreferences.favoriteMovies.join(', ')}` : ''}

Please return ONLY a JSON array of movie titles (exactly as they appear in the list above) that you recommend, in order of relevance. Format: ["Movie Title 1", "Movie Title 2", ...]`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const text = content.text.trim();
      // Extract JSON array from response
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        const recommendedTitles = JSON.parse(jsonMatch[0]) as string[];
        // Map titles back to Movie objects
        return recommendedTitles
          .map(title => movies.find(m => m.title === title))
          .filter((m): m is Movie => m !== undefined)
          .slice(0, 5);
      }
    }

    // Fallback: return top-rated movies
    return movies
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  } catch (error) {
    console.error('AI recommendation error:', error);
    // Fallback: return top-rated movies
    return request.movies
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }
}

/**
 * Find similar movies to a given movie using Claude AI
 */
export async function getSimilarMovies(
  request: AISimilarMoviesRequest
): Promise<Movie[]> {
  try {
    const { movie, allMovies } = request;
    
    const otherMovies = allMovies
      .filter(m => m.id !== movie.id)
      .map(m => ({
        title: m.title,
        genre: m.genre,
        rating: m.rating,
        synopsis: m.synopsis.substring(0, 150),
      }))
      .slice(0, 15);

    const prompt = `Find 5 movies similar to "${movie.title}" (Genre: ${movie.genre}, Rating: ${movie.rating}/10).

Movie Details:
- Title: ${movie.title}
- Genre: ${movie.genre}
- Rating: ${movie.rating}/10
- Synopsis: ${movie.synopsis.substring(0, 200)}

Available Movies:
${JSON.stringify(otherMovies, null, 2)}

Return ONLY a JSON array of movie titles (exactly as they appear above) that are similar. Format: ["Movie Title 1", "Movie Title 2", ...]`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const text = content.text.trim();
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        const similarTitles = JSON.parse(jsonMatch[0]) as string[];
        return similarTitles
          .map(title => allMovies.find(m => m.title === title))
          .filter((m): m is Movie => m !== undefined)
          .slice(0, 5);
      }
    }

    // Fallback: return movies with same genre
    return allMovies
      .filter(m => m.id !== movie.id && m.genre === movie.genre)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  } catch (error) {
    console.error('AI similar movies error:', error);
    // Fallback: return movies with same genre
    return request.allMovies
      .filter(m => m.id !== request.movie.id && m.genre === request.movie.genre)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }
}

/**
 * Generate AI-enhanced synopsis for a movie
 */
export async function generateAISynopsis(movie: Movie): Promise<string> {
  try {
    const prompt = `Write an engaging, concise movie synopsis (2-3 sentences) for "${movie.title}" (${movie.genre}).

Current synopsis: ${movie.synopsis}

Make it more engaging and appealing while keeping it concise. Return only the synopsis text, no additional formatting.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text.trim();
    }

    return movie.synopsis; // Fallback to original
  } catch (error) {
    console.error('AI synopsis generation error:', error);
    return movie.synopsis; // Fallback to original
  }
}

/**
 * Get trending movies based on AI analysis
 */
export async function getTrendingMovies(movies: Movie[]): Promise<Movie[]> {
  try {
    const moviesList = movies.map(m => ({
      title: m.title,
      genre: m.genre,
      rating: m.rating,
      releaseDate: m.releaseDate,
    })).slice(0, 20);

    const prompt = `Based on ratings, release dates, and genres, identify 5 trending movies that are currently popular.

Movies:
${JSON.stringify(moviesList, null, 2)}

Return ONLY a JSON array of movie titles in order of trending popularity. Format: ["Movie Title 1", "Movie Title 2", ...]`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const text = content.text.trim();
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        const trendingTitles = JSON.parse(jsonMatch[0]) as string[];
        return trendingTitles
          .map(title => movies.find(m => m.title === title))
          .filter((m): m is Movie => m !== undefined)
          .slice(0, 5);
      }
    }

    // Fallback: return highest rated recent movies
    return movies
      .sort((a, b) => {
        const dateA = new Date(a.releaseDate).getTime();
        const dateB = new Date(b.releaseDate).getTime();
        return dateB - dateA; // Most recent first
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  } catch (error) {
    console.error('AI trending movies error:', error);
    return movies
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }
}

