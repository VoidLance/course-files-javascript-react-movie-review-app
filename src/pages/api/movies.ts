import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '../../env';
import type { Movie } from '../../types/movie';
import { fetchPopularMovies, fetchMoviesByGenre, fetchTopRatedMovies, searchMovies, searchMoviesByActor } from '../../utils/tmdb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type = 'popular', genres, page = '1', query, actor } = req.query;
  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);

  try {
    let movies: Movie[] = [];
    const apiKey = env.TMDB_API_KEY as string;

    // If an actor search query is provided, search for movies by actor
    if (actor && typeof actor === 'string' && actor.trim()) {
      movies = await searchMoviesByActor(apiKey, actor, pageNum);
    }
    // If a search query is provided, search for movies
    else if (query && typeof query === 'string' && query.trim()) {
      movies = await searchMovies(apiKey, query, pageNum);
    } else if (type === 'popular') {
      movies = await fetchPopularMovies(apiKey, pageNum);
    } else if (type === 'top_rated') {
      movies = await fetchTopRatedMovies(apiKey, pageNum);
    } else if (type === 'by_genre' && genres) {
      const genreIds = (genres as string).split(',').map((id) => parseInt(id, 10));
      movies = await fetchMoviesByGenre(apiKey, genreIds, pageNum);
    } else {
      // Default to popular
      movies = await fetchPopularMovies(apiKey, pageNum);
    }

    res.status(200).json({ movies });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
}

