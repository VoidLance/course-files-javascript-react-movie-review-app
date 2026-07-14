import MovieCard from './MovieCard';
import { type Movie } from '../types/movie';

const MovieList = ({
  movies,
  updateMovieRating,
}: {
  movies: Movie[];
  updateMovieRating?: (movie: Movie, rating: number) => void;
}) => {
  const handleExistingRating = (movie: Movie, rating: number) => {
    if (!updateMovieRating) {
      return;
    }
    updateMovieRating(movie, Math.round(rating));
  };

  return (
    <ul className="grid grid-cols-4 mt-8 movie-list">
      {movies.map((movie, index) => (
        <li key={String(movie.id ?? `${movie.name}-${index}`)}>
          <MovieCard
            id={movie.id}
            name={movie.name}
            img={movie.img}
            alt={movie.alt}
            description={movie.description}
            rating={movie.rating}
            genres={movie.genres}
            onRate={updateMovieRating ? (rating: number) => handleExistingRating(movie, rating) : undefined}
          />
        </li>
      ))}
    </ul>
  );
};

export default MovieList;

