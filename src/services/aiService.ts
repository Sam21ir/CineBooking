import { GoogleGenerativeAI } from '@google/generative-ai';
import { Movie } from '../store/slices/moviesSlice';

// ─── Config Gemini (inchangé) ─────────────────────────────────────────────────

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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

// ─── Proxy n8n (Workflow 5) — optionnel, clé sécurisée côté serveur ──────────

const N8N_AI_WEBHOOK = import.meta.env.VITE_N8N_AI_WEBHOOK || 'https://79bb3796.kube-ops.com/webhook/cinebooking-ai';

/**
 * Appelle Gemini via le proxy n8n (la clé API reste côté serveur n8n).
 * Retourne null si le webhook n'est pas configuré ou échoue.
 */
async function callAIProxy(payload: {
  type: 'recommendations' | 'synopsis' | 'similar' | 'trending';
  movieTitle?: string;
  genre?: string;
  synopsis?: string;
  moviesList?: string[];
  userPreferences?: string;
}): Promise<unknown | null> {
  if (!N8N_AI_WEBHOOK) return null;

  try {
    const res = await fetch(N8N_AI_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success ? data.data : null;
  } catch {
    return null; // non-bloquant
  }
}

// ─── Fonctions existantes (inchangées) ───────────────────────────────────────

export async function getPersonalizedRecommendations(
  request: AIRecommendationRequest
): Promise<Movie[]> {
  if (!isAIAvailable() || !genAI) {
    console.log('🤖 AI not available, using fallback recommendations');
    const shuffled = [...request.movies].sort(() => Math.random() - 0.5);
    return shuffled
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }

  try {
    const { movies, userPreferences } = request;
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
    throw new Error('Invalid JSON format');
  } catch (error) {
    console.error('🤖 AI Error:', error);
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
  if (!isAIAvailable() || !genAI) {
    console.log('🤖 AI not available, using fallback trending movies');
    const shuffled = [...movies].sort(() => Math.random() - 0.5);
    return shuffled
      .sort((a, b) => {
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
    const shuffledFallback = [...movies].sort(() => Math.random() - 0.5);
    return shuffledFallback.slice(0, 5);
  } catch (e) {
    console.error('🤖 AI Error:', e);
    const shuffled = [...movies].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }
}

// ─── Nouvelles fonctions utilisant le proxy n8n (Workflow 5) ─────────────────

/**
 * Version proxy n8n de getSimilarMovies.
 * Utilise n8n si disponible, sinon repasse sur getSimilarMovies() existant.
 *
 * @example
 * const similar = await getSimilarMoviesWithProxy({ movie, allMovies });
 */
export async function getSimilarMoviesWithProxy(request: AISimilarMoviesRequest): Promise<Movie[]> {
  // Tentative via proxy n8n (clé sécurisée côté serveur)
  const proxyResult = await callAIProxy({
    type: 'similar',
    movieTitle: request.movie.title,
    genre: request.movie.genre,
    moviesList: request.allMovies.filter(m => m.id !== request.movie.id).map(m => m.title),
  }) as { titles?: string[] } | null;

  if (proxyResult?.titles && proxyResult.titles.length > 0) {
    console.log('🤖 Similar movies via n8n proxy:', proxyResult.titles);
    return proxyResult.titles
      .map((t: string) => request.allMovies.find(m => m.title === t))
      .filter((m): m is Movie => !!m);
  }

  // Fallback : fonction existante
  return getSimilarMovies(request);
}

/**
 * Version proxy n8n de generateAISynopsis.
 * Utilise n8n si disponible, sinon repasse sur generateAISynopsis() existant.
 */
export async function generateAISynopsisWithProxy(movie: Movie): Promise<string> {
  const proxyResult = await callAIProxy({
    type: 'synopsis',
    movieTitle: movie.title,
    synopsis: movie.synopsis,
  }) as { text?: string } | null;

  if (proxyResult?.text) {
    console.log('🤖 Synopsis via n8n proxy ✅');
    return proxyResult.text;
  }

  // Fallback : fonction existante
  return generateAISynopsis(movie);
}

/**
 * Generates a response for the AI Chatbot based on user query and available movies.
 */
export async function getChatResponse(
  message: string,
  movies: Movie[],
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  if (!isAIAvailable() || !genAI) {
    return "Je suis désolé, je ne peux pas répondre pour le moment car l'IA n'est pas configurée.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const moviesContext = movies.map(m => ({
      title: m.title,
      genre: m.genre,
      rating: m.rating,
    })).slice(0, 15);

    // Prompt de système intégré directement pour plus de stabilité
    const systemPrompt = `Tu es l'assistant IA de CineBooking. Réponds de manière amicale et concise.
Films disponibles : ${JSON.stringify(moviesContext)}
Règles : Maximum 3 phrases. Emojis autorisés. Ne parle que des films de la liste.`;

    // Construction manuelle de la conversation pour éviter les erreurs de session SDK
    // On prend les 4 derniers messages pour garder du contexte sans saturer le prompt
    const recentHistory = history.slice(-4);
    const historyText = recentHistory.map(h => `${h.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${h.content}`).join('\n');

    const fullPrompt = `${systemPrompt}\n\n${historyText}\nUtilisateur: ${message}\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error('🤖 Chat AI Error:', error);
    return "Désolé, j'ai une petite panne de connexion. Réessayez dans un instant !";
  }
}
