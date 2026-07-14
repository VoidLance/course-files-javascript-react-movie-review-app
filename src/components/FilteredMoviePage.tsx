import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import MovieCard from './MovieCard';
import SearchBar, { type SortBy, type SortOrder } from './SearchBar';
import { type Movie, GENRES, type Genre, GENRE_TO_TMDB_IDS } from '../types/movie';

interface FilteredMoviePageProps {
  title: string;
  apiType: 'popular' | 'top_rated' | 'by_genre';
  genreIds?: number[];
  emptyMessage: string;
  showGenreFilter?: boolean;
}

const FilteredMoviePage = ({ title, apiType, genreIds, emptyMessage, showGenreFilter = false }: FilteredMoviePageProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actorSearch, setActorSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('popularity');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [minRating, setMinRating] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<'all' | Genre>('all');
  const [currentGenreIds, setCurrentGenreIds] = useState<number[] | undefined>(genreIds);

  // Load movies from API
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        let url = '/api/movies';
        let idsToUse = currentGenreIds;

        // If actor search is active, search by actor
        if (actorSearch.trim()) {
          url = `/api/movies?actor=${encodeURIComponent(actorSearch)}`;
        }
        // If genre filter is shown and a genre is selected, override the genreIds
        else if (showGenreFilter && selectedGenre !== 'all') {
          idsToUse = GENRE_TO_TMDB_IDS[selectedGenre];
          if (apiType === 'top_rated') {
            url = '/api/movies?type=top_rated';
          } else if (idsToUse) {
            url = `/api/movies?type=by_genre&genres=${idsToUse.join(',')}`;
          } else {
            url = '/api/movies?type=popular';
          }
        } else if (apiType === 'top_rated') {
          url = '/api/movies?type=top_rated';
        } else if ((apiType === 'by_genre' || showGenreFilter) && idsToUse) {
          url = `/api/movies?type=by_genre&genres=${idsToUse.join(',')}`;
        } else {
          url = '/api/movies?type=popular';
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to load movies');
        }

        const data = (await response.json()) as { movies?: Movie[] };
        const storedMovies = Array.isArray(data.movies) ? data.movies : [];
        setMovies(storedMovies);

        if (storedMovies.length === 0) {
          if (actorSearch.trim()) {
            setStatusMessage(`No movies found for actor "${actorSearch}".`);
          } else {
            setStatusMessage(emptyMessage);
          }
        }
      } catch (error) {
        console.error('Failed to load movies', error instanceof Error ? error.message : 'Unknown error');
        setStatusMessage('Failed to load movies.');
      } finally {
        setLoading(false);
      }
    };

    void loadMovies();
  }, [apiType, currentGenreIds, selectedGenre, showGenreFilter, emptyMessage, actorSearch]);

  // Apply filtering and sorting
  useEffect(() => {
    let result = [...movies];

    // Apply search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((movie) =>
        movie.name.toLowerCase().includes(lowerSearch) ||
        movie.description.toLowerCase().includes(lowerSearch)
      );
      setIsSearchActive(true);
    } else if (actorSearch.trim()) {
      // Actor search is active, results already sorted by cast prominence from API
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }

    // Apply minimum rating filter
    result = result.filter((movie) => movie.rating >= minRating);

    // Apply sorting - SKIP if actor search is active (results already sorted by cast prominence)
    if (!actorSearch.trim()) {
      result.sort((a, b) => {
        let aValue: number | string = 0;
        let bValue: number | string = 0;

        switch (sortBy) {
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'popularity':
            aValue = a.popularity ?? 0;
            bValue = b.popularity ?? 0;
            break;
          case 'release_date':
            aValue = a.releaseDate ?? '';
            bValue = b.releaseDate ?? '';
            break;
          case 'title':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          default:
            aValue = a.popularity ?? 0;
            bValue = b.popularity ?? 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        const aNum = typeof aValue === 'number' ? aValue : 0;
        const bNum = typeof bValue === 'number' ? bValue : 0;
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      });
    }

    setFilteredMovies(result);
  }, [movies, searchTerm, actorSearch, sortBy, sortOrder, minRating]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setActorSearch('');
  };

  const handleActorSearch = (actor: string) => {
    setActorSearch(actor);
  };

  const handleSort = (newSortBy: SortBy, newSortOrder: SortOrder, newMinRating: number) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setMinRating(newMinRating);
  };

  const handleGenreChange = (genre: 'all' | Genre) => {
    setSelectedGenre(genre);
  };

  const updateMovieRating = (_targetMovie: Movie, _rating: number) => {
    // Note: Ratings are now read-only from TMDB
    // This is kept for future local rating feature if needed
    console.log('Rating updates are not persisted in TMDB API mode');
  };

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <h2 className={`text-2xl font-semibold ${isDark ? 'text-amber-100' : 'text-amber-100'}`}>{title}</h2>
      <SearchBar 
        onSearch={handleSearch} 
        onSort={handleSort} 
        onActorSearch={handleActorSearch}
        isSearchActive={isSearchActive}
        onGenreChange={showGenreFilter ? handleGenreChange : undefined}
        selectedGenre={showGenreFilter ? selectedGenre : 'all'}
        showGenreFilter={showGenreFilter}
      />
      {statusMessage && (
        <div className="rounded bg-rose-400 px-4 py-2 text-sm font-semibold text-[#2d2d2d]">
          {statusMessage}
        </div>
      )}
      {loading && (
        <div className="rounded bg-rose-400 px-4 py-2 text-sm font-semibold text-[#2d2d2d]">
          Loading movies...
        </div>
      )}
      {filteredMovies.length === 0 && !loading && movies.length > 0 ? (
        <p className={`${isDark ? 'text-amber-100' : 'text-amber-100'}`}>No movies match your filters. Try adjusting your search or filters.</p>
      ) : filteredMovies.length === 0 && !loading ? (
        <p className={`${isDark ? 'text-amber-100' : 'text-amber-100'}`}>{emptyMessage}</p>
      ) : (
        <ul className="grid grid-cols-4 gap-2 mt-8 movie-list">
          {filteredMovies.map((movie, index) => (
            <li key={String(movie.id ?? `${movie.name}-${index}`)}>
              <MovieCard
                id={movie.id}
                name={movie.name}
                img={movie.img}
                alt={movie.alt}
                description={movie.description}
                rating={movie.rating}
                genres={movie.genres}
                onRate={(rating: number) => updateMovieRating(movie, rating)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default FilteredMoviePage;
