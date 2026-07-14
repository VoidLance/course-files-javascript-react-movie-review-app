export const GENRES = ['action', 'fantasy', 'romance', 'comedy', 'anime', 'drama', 'horror'] as const;

export type Genre = (typeof GENRES)[number];

export interface Actor {
  id: number;
  name: string;
  character?: string;
  profilePath?: string;
}

export interface Movie {
  id?: number; // TMDB movie ID
  name: string;
  img: string;
  alt: string;
  description: string;
  rating: number; // Integer 0-5 or decimal from TMDB
  genres: Genre[];
  popularity?: number; // TMDB popularity score
  releaseDate?: string; // TMDB release date
  cast?: Actor[]; // Cast members
  castPosition?: number; // Actor's billing position (for actor search sorting)
}

// Map TMDB genre IDs to our custom genres
export const TMDB_GENRE_MAP: Record<number, Genre | undefined> = {
  28: 'action', // Action
  12: 'fantasy', // Adventure (used for fantasy)
  14: 'fantasy', // Fantasy
  10749: 'romance', // Romance
  35: 'comedy', // Comedy
  16: 'anime', // Animation
};

// Map our genres to TMDB genre IDs for filtering
export const GENRE_TO_TMDB_IDS: Record<Genre, number[]> = {
  action: [28],
  comedy: [35],
  drama: [18],
  horror: [27],
  romance: [10749],
  fantasy: [12, 14],
  anime: [16],
} as const;

