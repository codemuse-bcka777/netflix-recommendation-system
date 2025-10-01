import { Movie, TMDBSearchResponse, Genre } from '@/types/movie';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
};

let genreCache: Genre[] | null = null;

export async function fetchGenres(): Promise<Genre[]> {
  if (genreCache) {
    return genreCache;
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }

    const data = await response.json();
    genreCache = data.genres;
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&page=1`
    );

    if (!response.ok) {
      throw new Error('Failed to search movies');
    }

    const data: TMDBSearchResponse = await response.json();
    return data.results.slice(0, 10);
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

export async function getMovieDetails(movieId: number): Promise<Movie | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function getMoviesByTitles(titles: string[]): Promise<Movie[]> {
  const genres = await fetchGenres();
  const movies: Movie[] = [];

  for (const title of titles) {
    const results = await searchMovies(title);
    if (results.length > 0) {
      const movie = results[0];
      movie.genres = movie.genre_ids
        .map((id) => genres.find((g) => g.id === id))
        .filter((g): g is Genre => g !== undefined);
      movies.push(movie);
    }
  }

  return movies;
}

export function getPosterUrl(
  posterPath: string | null,
  size: keyof typeof POSTER_SIZES = 'medium'
): string {
  if (!posterPath) {
    return '/placeholder-movie.png';
  }
  return `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZES[size]}${posterPath}`;
}

export function getBackdropUrl(backdropPath: string | null): string {
  if (!backdropPath) {
    return '/placeholder-backdrop.png';
  }
  return `${TMDB_IMAGE_BASE_URL}/w1280${backdropPath}`;
}