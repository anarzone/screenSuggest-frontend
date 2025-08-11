export interface Movie {
  id: number | string;
  title: string;
  originalTitle?: string;
  year?: number;
  poster_url?: string;
  rating?: number | string;
  genres?: string[];
  director?: string;
  cast?: string[];
  synopsis?: string;
  description?: string;
  duration?: number;
  release_date?: string;
  releaseDate?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface SearchFilters {
  query?: string;
  q?: string;
  genre?: string;
  yearFrom?: number;
  yearTo?: number;
  ratingFrom?: number;
  ratingMin?: string;
  ratingMax?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface Comment {
  id: number;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
}

export interface MovieDetails extends Movie {
  comments?: Comment[];
  similar_movies?: Movie[];
  votes_up?: number;
  votes_down?: number;
}