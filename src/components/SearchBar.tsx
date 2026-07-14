import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { GENRES, type Genre } from '../types/movie';

export type SortBy = 'popularity' | 'rating' | 'release_date' | 'title';
export type SortOrder = 'asc' | 'desc';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onSort: (sortBy: SortBy, sortOrder: SortOrder, minRating: number) => void;
  onGenreChange?: (genre: 'all' | Genre) => void;
  onActorSearch?: (actorName: string) => void;
  selectedGenre?: 'all' | Genre;
  isSearchActive: boolean;
  showGenreFilter?: boolean;
}

const SearchBar = ({ 
  onSearch, 
  onSort, 
  onGenreChange,
  onActorSearch,
  selectedGenre = 'all',
  isSearchActive,
  showGenreFilter = false
}: SearchBarProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [actorSearch, setActorSearch] = useState('');
  const [searchMode, setSearchMode] = useState<'movie' | 'actor'>('movie');
  const [sortBy, setSortBy] = useState<SortBy>('popularity');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchMode === 'actor') {
      if (actorSearch.trim()) {
        onActorSearch?.(actorSearch);
      }
    } else {
      if (searchTerm.trim()) {
        onSearch(searchTerm);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActorSearch('');
    onSearch('');
  };

  const handleSortChange = () => {
    onSort(sortBy, sortOrder, minRating);
  };

  const handleSortByChange = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
    if (showFilters) {
      onSort(newSortBy, sortOrder, minRating);
    }
  };

  const handleSortOrderChange = (newSortOrder: SortOrder) => {
    setSortOrder(newSortOrder);
    if (showFilters) {
      onSort(sortBy, newSortOrder, minRating);
    }
  };

  const handleMinRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMinRating(value);
    if (showFilters) {
      onSort(sortBy, sortOrder, value);
    }
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genre = e.target.value as 'all' | Genre;
    onGenreChange?.(genre);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setSearchMode('movie');
            setActorSearch('');
          }}
          className={`flex-1 rounded-lg px-4 py-2 font-semibold transition-colors ${
            searchMode === 'movie'
              ? 'bg-rose-400 text-[#2d2d2d]'
              : 'bg-[#6b5644] text-amber-100 hover:bg-[#7a6652]'
          }`}
        >
          🎬 Search Movies
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchMode('actor');
            setSearchTerm('');
          }}
          className={`flex-1 rounded-lg px-4 py-2 font-semibold transition-colors ${
            searchMode === 'actor'
              ? 'bg-rose-400 text-[#2d2d2d]'
              : 'bg-[#6b5644] text-amber-100 hover:bg-[#7a6652]'
          }`}
        >
          🎭 Search Actors
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder={searchMode === 'actor' ? "Enter actor name..." : "Search movies by title..."}
          value={searchMode === 'actor' ? actorSearch : searchTerm}
          onChange={(e) => {
            if (searchMode === 'actor') {
              setActorSearch(e.target.value);
            } else {
              setSearchTerm(e.target.value);
            }
          }}
          className={`flex-1 rounded-lg border px-4 py-2 transition-colors ${
            isDark
              ? 'border-rose-400 bg-[#2d2d2d] text-amber-100 placeholder-amber-700 focus:border-rose-300 focus:outline-none'
              : 'border-rose-400 bg-[#6b5644] text-amber-100 placeholder-amber-700 focus:border-rose-300 focus:outline-none'
          }`}
        />
        <button
          type="submit"
          className="rounded-lg bg-rose-400 px-6 py-2 font-semibold text-[#2d2d2d] hover:bg-rose-300 transition-colors"
        >
          {searchMode === 'actor' ? '🎭 Search Actor' : '🎬 Search'}
        </button>
        {((searchMode === 'actor' && actorSearch) || (searchMode === 'movie' && searchTerm)) && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="rounded-lg bg-[#6b5644] px-6 py-2 font-semibold text-amber-100 hover:bg-[#7a6652] transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 rounded-lg bg-rose-400 px-4 py-2 font-semibold text-[#2d2d2d] hover:bg-rose-300 transition-colors"
      >
        {showFilters ? '▼ Hide Filters' : '▶ Show Filters'}
      </button>

      {/* Filters Section */}
      {showFilters && (
        <div className={`mb-6 rounded-lg border border-rose-400 p-4 ${
          isDark ? 'bg-[#2d2d2d]' : 'bg-[#6b5644]'
        }`}>
          <div className="space-y-4">
            {/* Genre Filter (if enabled) */}
            {showGenreFilter && (
              <div>
                <label htmlFor="genreFilter" className="block text-sm font-semibold text-amber-100 mb-2">
                  Filter by Genre:
                </label>
                <select
                  id="genreFilter"
                  value={selectedGenre}
                  onChange={handleGenreChange}
                  className={`w-full rounded border border-rose-400 px-3 py-2 text-sm text-amber-100 ${
                    isDark ? 'bg-[#1a1a1a]' : 'bg-[#5a4537]'
                  }`}
                >
                  <option value="all">All Genres</option>
                  {GENRES.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-amber-100 mb-2">
                Sort By:
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(['popularity', 'rating', 'release_date', 'title'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortByChange(option)}
                    className={`rounded px-3 py-2 text-sm font-semibold transition-colors ${
                      sortBy === option
                        ? 'bg-rose-400 text-[#2d2d2d]'
                        : 'bg-[#5a4537] text-amber-100 hover:bg-[#6b5644]'
                    }`}
                  >
                    {option === 'release_date' ? 'Release Date' : option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-semibold text-amber-100 mb-2">
                Sort Order:
              </label>
              <div className="flex gap-2">
                {(['asc', 'desc'] as const).map((order) => (
                  <button
                    key={order}
                    onClick={() => handleSortOrderChange(order)}
                    className={`flex-1 rounded px-3 py-2 font-semibold transition-colors ${
                      sortOrder === order
                        ? 'bg-rose-400 text-[#2d2d2d]'
                        : 'bg-[#5a4537] text-amber-100 hover:bg-[#6b5644]'
                    }`}
                  >
                    {order === 'asc' ? '↑ Ascending' : '↓ Descending'}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <label className="block text-sm font-semibold text-amber-100 mb-2">
                Minimum Rating: {minRating} / 5 ⭐
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={minRating}
                onChange={handleMinRatingChange}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-amber-700 mt-1">
                <span>0</span>
                <span>5</span>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleSortChange}
              className="w-full rounded-lg bg-rose-400 px-4 py-2 font-semibold text-[#2d2d2d] hover:bg-rose-300 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;


