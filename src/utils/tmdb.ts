import { type Movie, TMDB_GENRE_MAP, type Genre, type Actor } from '../types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  popularity: number;
  release_date: string;
  genre_ids: number[];
}

interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface TMDBCredits {
  cast?: TMDBCast[];
}

/**
 * Convert TMDB cast to our Actor format
 */
export const convertTMDBCast = (tmdbCast: TMDBCast[]): Actor[] => {
  return tmdbCast.slice(0, 10).map((actor) => ({
    id: actor.id,
    name: actor.name,
    character: actor.character,
    profilePath: actor.profile_path ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}` : undefined,
  }));
};

/**
 * Fetch cast information for a movie
 */
export const fetchMovieCast = async (apiKey: string, movieId: number): Promise<Actor[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = (await response.json()) as TMDBCredits;
    const cast = data.cast ?? [];

    return convertTMDBCast(cast);
  } catch (error) {
    console.error(`Failed to fetch cast for movie ${movieId} from TMDB:`, error);
    return [];
  }
};

/**
 * Convert TMDB genre IDs to our supported genres
 */
export const convertTMDBGenres = (tmdbGenreIds: number[]): Genre[] => {
  const genres = tmdbGenreIds
    .map((id) => TMDB_GENRE_MAP[id])
    .filter((genre): genre is Genre => genre !== undefined);

  // If no genres mapped, default to action
  return genres.length > 0 ? genres : ['action'];
};

/**
 * Convert TMDB movie to our Movie format
 */
export const convertTMDBMovie = (tmdbMovie: TMDBMovie): Movie => {
  const posterPath = tmdbMovie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}`
    : '/images/placeholder.svg';

  // TMDB rating is 0-10, convert to 0-5
  const rating = Math.round((tmdbMovie.vote_average / 10) * 5);

  return {
    id: tmdbMovie.id,
    name: tmdbMovie.title,
    img: posterPath,
    alt: `${tmdbMovie.title} poster`,
    description: tmdbMovie.overview || 'No description available.',
    rating: Math.max(0, Math.min(5, rating)), // Clamp to 0-5
    genres: convertTMDBGenres(tmdbMovie.genre_ids),
    popularity: tmdbMovie.popularity,
    releaseDate: tmdbMovie.release_date,
  };
};

/**
 * Fetch popular movies from TMDB
 */
export const fetchPopularMovies = async (apiKey: string, page = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&page=${page}&sort_by=popularity.desc`,
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = (await response.json()) as { results?: TMDBMovie[] };
    const tmdbMovies = data.results ?? [];

    return tmdbMovies.map(convertTMDBMovie);
  } catch (error) {
    console.error('Failed to fetch popular movies from TMDB:', error);
    return [];
  }
};

/**
 * Search movies by genre ID (combined from multiple genre IDs)
 */
export const fetchMoviesByGenre = async (
  apiKey: string,
  genreIds: number[],
  page = 1,
): Promise<Movie[]> => {
  try {
    const genreQuery = genreIds.join('|');
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=${genreQuery}&page=${page}&sort_by=popularity.desc`,
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = (await response.json()) as { results?: TMDBMovie[] };
    const tmdbMovies = data.results ?? [];

    return tmdbMovies.map(convertTMDBMovie);
  } catch (error) {
    console.error('Failed to fetch movies by genre from TMDB:', error);
    return [];
  }
};

/**
 * Search for movies by name
 */
export const searchMovies = async (apiKey: string, query: string, page = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`,
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = (await response.json()) as { results?: TMDBMovie[] };
    const tmdbMovies = data.results ?? [];

    return tmdbMovies.map(convertTMDBMovie);
  } catch (error) {
    console.error('Failed to search movies from TMDB:', error);
    return [];
  }
};

/**
 * Fetch top-rated movies
 */
export const fetchTopRatedMovies = async (apiKey: string, page = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${apiKey}&page=${page}`,
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = (await response.json()) as { results?: TMDBMovie[] };
    const tmdbMovies = data.results ?? [];

    return tmdbMovies.map(convertTMDBMovie);
  } catch (error) {
    console.error('Failed to fetch top-rated movies from TMDB:', error);
    return [];
  }
};

/**
 * Search for movies by actor name
 */
export const searchMoviesByActor = async (apiKey: string, actorName: string, page = 1): Promise<Movie[]> => {
  try {
    // First, search for the actor to get their ID
    const personResponse = await fetch(
      `${TMDB_BASE_URL}/search/person?api_key=${apiKey}&query=${encodeURIComponent(actorName)}`,
    );

    if (!personResponse.ok) {
      throw new Error(`TMDB API error: ${personResponse.status}`);
    }

    const personData = (await personResponse.json()) as { results?: Array<{ id: number; name: string }> };
    const results = personData.results ?? [];

    if (results.length === 0) {
      return [];
    }

    const actorId = results[0]?.id;
    const actualActorName = results[0]?.name;

    if (!actorId || !actualActorName) {
      return [];
    }

    // Now search for movies by this actor
    const movieResponse = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&with_cast=${actorId}&page=${page}&sort_by=popularity.desc`,
    );

    if (!movieResponse.ok) {
      throw new Error(`TMDB API error: ${movieResponse.status}`);
    }

    const movieData = (await movieResponse.json()) as { results?: TMDBMovie[] };
    const tmdbMovies = movieData.results ?? [];

    // Fetch cast for each movie and track actor's position
    const moviesWithCastPosition: Movie[] = [];
    
    for (const tmdbMovie of tmdbMovies) {
      const movie = convertTMDBMovie(tmdbMovie);
      
      // Fetch cast for this movie
      const cast = await fetchMovieCast(apiKey, tmdbMovie.id);
      movie.cast = cast;
      
      // Find the actor's position in the cast (billing order)
      const actorPosition = cast.findIndex(
        (castMember) => castMember.name.toLowerCase() === actualActorName.toLowerCase()
      );
      
      // Store the position (-1 if not found, but shouldn't happen)
      movie.castPosition = actorPosition >= 0 ? actorPosition : cast.length;
      
      moviesWithCastPosition.push(movie);
    }

    // Sort by cast position (lower is more prominent), then by popularity
    return moviesWithCastPosition.sort((a, b) => {
      const posA = a.castPosition ?? a.cast?.length ?? Infinity;
      const posB = b.castPosition ?? b.cast?.length ?? Infinity;
      
      if (posA !== posB) {
        return posA - posB; // Lower position = more prominent
      }
      
      // If same position, sort by popularity
      return (b.popularity ?? 0) - (a.popularity ?? 0);
    });
  } catch (error) {
    console.error('Failed to search movies by actor from TMDB:', error);
    return [];
  }
};
