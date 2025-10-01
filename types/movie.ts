export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
  similarity?: number; // Similarity percentage (0-100)
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface RecommendationResponse {
  recommendations: string[];
}