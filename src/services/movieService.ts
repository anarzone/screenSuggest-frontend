import apiClient from './api';
import type { Movie, Genre, SearchFilters, MovieDetails, ApiResponse } from './types';

export class MovieService {
  /**
   * Search for movies with optional filters
   */
  async searchMovies(filters: SearchFilters = {}): Promise<ApiResponse<Movie[]>> {
    try {
      // Transform parameters to match the expected API format
      const params: any = {
        page: filters.page || 1,
        limit: filters.limit || 20,
      };
      
      // Handle query parameter (use q if provided, otherwise query)
      if (filters.q) {
        params.q = filters.q;
      } else if (filters.query) {
        params.q = filters.query;
      }
      
      // Handle other search parameters
      if (filters.genre) params.genre = filters.genre;
      if (filters.ratingMin) params.ratingMin = filters.ratingMin;
      if (filters.ratingMax) params.ratingMax = filters.ratingMax;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters.yearFrom) params.yearFrom = filters.yearFrom;
      if (filters.yearTo) params.yearTo = filters.yearTo;
      if (filters.ratingFrom) params.ratingFrom = filters.ratingFrom;

      const response = await apiClient.get<Movie[]>('/movies', params);
      
      // Transform data to ensure consistent structure
      const movies = Array.isArray(response.data) ? response.data : response.data || [];
      
      // Transform API data to match our interface
      const transformedMovies = movies.map((movie: any) => ({
        ...movie,
        id: movie.id || movie._id,
        title: movie.title || movie.originalTitle || 'Unknown Title',
        year: movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined),
        synopsis: movie.synopsis || movie.description || '',
        rating: movie.rating || movie.imdbRating || undefined,
        genres: movie.genres || [],
        cast: movie.cast || [],
        director: movie.director || '',
        duration: movie.duration || movie.runtime || 0,
      }));
      
      return {
        data: transformedMovies,
        total: response.total || movies.length,
        page: response.page || 1,
        totalPages: response.totalPages || Math.ceil((response.total || movies.length) / (filters.limit || 20)),
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      // Return fallback data with mock movies for development
      return this.getMockMovies(filters);
    }
  }

  /**
   * Get a single movie by ID
   */
  async getMovieById(id: number | string): Promise<MovieDetails> {
    try {
      const response = await apiClient.get<MovieDetails>(`/movies/${id}`);
      const movie = response.data;
      
      // Transform API data to match our interface
      const transformedMovie: MovieDetails = {
        ...movie,
        id: movie.id || id,
        title: movie.title || movie.originalTitle || 'Unknown Title',
        year: movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 0),
        synopsis: movie.synopsis || movie.description || '',
        rating: movie.rating || movie.imdbRating || 0,
        genres: movie.genres || [],
        cast: movie.cast || [],
        director: movie.director || '',
        duration: movie.duration || movie.runtime || 0,
        comments: movie.comments || [],
        similar_movies: movie.similar_movies || [],
        votes_up: movie.votes_up || 0,
        votes_down: movie.votes_down || 0,
      };
      
      return transformedMovie;
    } catch (error) {
      console.error('Error fetching movie:', error);
      // Return mock movie data for development
      return this.getMockMovieDetails(id);
    }
  }

  /**
   * Get all available genres
   */
  async getGenres(): Promise<Genre[]> {
    try {
      const response = await apiClient.get<Genre[]>('/genres');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching genres:', error);
      // Return mock genres for development
      return this.getMockGenres();
    }
  }

  /**
   * Get featured/popular movies for homepage
   */
  async getFeaturedMovies(): Promise<Movie[]> {
    try {
      const response = await this.searchMovies({ limit: 10 });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      return [];
    }
  }

  /**
   * Search movies with the specific parameters requested by the user
   */
  async searchMoviesWithParams(searchParams: {
    q?: string;
    genre?: string;
    ratingMin?: string;
    ratingMax?: string;
    sortBy?: string;
    sortOrder?: string;
    limit?: number;
    page?: number;
  }): Promise<{ movies: Movie[]; total: number; totalPages: number; page: number }> {
    try {
      const response = await this.searchMovies(searchParams);
      return {
        movies: response.data,
        total: response.total || 0,
        totalPages: response.totalPages || 1,
        page: response.page || 1,
      };
    } catch (error) {
      console.error('Error searching movies with params:', error);
      // Return fallback mock data
      const mockData = this.getMockMovies(searchParams);
      return {
        movies: mockData.data,
        total: mockData.total || 0,
        totalPages: mockData.totalPages || 1,
        page: mockData.page || 1,
      };
    }
  }

  // Mock data methods for development/fallback
  private getMockMovies(filters: SearchFilters): ApiResponse<Movie[]> {
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: 'Inception',
        year: 2010,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Inception',
        rating: 8.8,
        genres: ['Action', 'Sci-Fi', 'Thriller'],
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page'],
        synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        duration: 148,
      },
      {
        id: 2,
        title: 'Interstellar',
        year: 2014,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Interstellar',
        rating: 8.6,
        genres: ['Adventure', 'Drama', 'Sci-Fi'],
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
        synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        duration: 169,
      },
      {
        id: 3,
        title: 'The Matrix',
        year: 1999,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Matrix',
        rating: 8.7,
        genres: ['Action', 'Sci-Fi'],
        director: 'The Wachowskis',
        cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
        synopsis: 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.',
        duration: 136,
      },
    ];

    return {
      data: mockMovies,
      total: mockMovies.length,
      page: 1,
      totalPages: 1,
    };
  }

  private getMockMovieDetails(id: number | string): MovieDetails {
    return {
      id,
      title: 'Inception',
      year: 2010,
      poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Inception',
      rating: 8.8,
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page'],
      synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
      duration: 148,
      release_date: 'July 16, 2010',
      comments: [
        {
          id: 1,
          user_name: 'Alex Chen',
          user_avatar: 'https://via.placeholder.com/40x40/D97706/ffffff?text=AC',
          content: 'This movie completely blew my mind! The concept of dreams within dreams is executed perfectly. Nolan\'s direction is masterful.',
          created_at: '2 hours ago',
        },
        {
          id: 2,
          user_name: 'Sarah Johnson',
          user_avatar: 'https://via.placeholder.com/40x40/F59E0B/ffffff?text=SJ',
          content: 'The visual effects are stunning and the soundtrack by Hans Zimmer is absolutely incredible. A true cinematic masterpiece!',
          created_at: '5 hours ago',
        },
      ],
      similar_movies: [
        {
          id: 2,
          title: 'Interstellar',
          year: 2014,
          poster_url: 'https://via.placeholder.com/192x288/1a1a1a/ffffff?text=Interstellar',
          rating: 8.6,
          genres: ['Adventure', 'Drama', 'Sci-Fi'],
          director: 'Christopher Nolan',
          cast: ['Matthew McConaughey', 'Anne Hathaway'],
          synopsis: '',
          duration: 169,
        },
      ],
      votes_up: 1247,
      votes_down: 89,
    };
  }

  private getMockGenres(): Genre[] {
    return [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
      { id: 3, name: 'Comedy' },
      { id: 4, name: 'Drama' },
      { id: 5, name: 'Horror' },
      { id: 6, name: 'Sci-Fi' },
      { id: 7, name: 'Thriller' },
    ];
  }
}

export default new MovieService();