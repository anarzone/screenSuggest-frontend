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

      if (filters.q) {
        params.q = filters.q;
      }
      
      // Handle other search parameters - match API specification
      if (filters.genre) params.genre = filters.genre;
      
      // Handle rating parameters (support both old and new naming)
      if (filters.ratingMin) params.imdbRatingMin = filters.ratingMin;
      if (filters.ratingMax) params.imdbRatingMax = filters.ratingMax;
      if (filters.imdbRatingMin) params.imdbRatingMin = filters.imdbRatingMin;
      if (filters.imdbRatingMax) params.imdbRatingMax = filters.imdbRatingMax;
      if (filters.ratingFrom) params.imdbRatingMin = filters.ratingFrom;
      
      // Handle year parameters (support both old and new naming)
      if (filters.yearFrom) params.yearStart = filters.yearFrom;
      if (filters.yearTo) params.yearEnd = filters.yearTo;
      if (filters.yearStart) params.yearStart = filters.yearStart;
      if (filters.yearEnd) params.yearEnd = filters.yearEnd;
      
      // Map sort parameters to API specification
      if (filters.sortBy) {
        const sortMap: { [key: string]: string } = {
          'title': 'title',
          'year': 'releaseDate', 
          'rating': 'imdbRating',
          'popularity': 'imdbRating' // fallback to rating for popularity
        };
        params.sortBy = sortMap[filters.sortBy] || filters.sortBy;
      }
      if (filters.sortOrder) {
        params.sortOrder = filters.sortOrder.toUpperCase(); // API expects ASC/DESC
      }

      const response = await apiClient.get<any>('/movies', params);
      
      // Handle API response structure - data might be at response.data or response.data.data
      const movies = Array.isArray(response.data?.data) ? response.data.data : 
                     Array.isArray(response.data) ? response.data : [];
      
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
      
      // Handle API response structure with pagination object
      const pagination = response.data?.pagination || response.pagination;
      
      return {
        data: transformedMovies,
        total: pagination?.total_items || response.total || movies.length,
        page: pagination?.current_page || response.page || 1,
        totalPages: pagination?.total_pages || response.totalPages || Math.ceil((pagination?.total_items || response.total || movies.length) / (filters.limit || 20)),
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
      console.error('Error searching movies with params, using mock data:', error);
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
    // Simulate pagination for testing
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    
    const allMockMovies: Movie[] = [
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
      // Add more movies to simulate multiple pages
      {
        id: 4,
        title: 'Pulp Fiction',
        year: 1994,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Pulp+Fiction',
        rating: 8.9,
        genres: ['Crime', 'Drama'],
        director: 'Quentin Tarantino',
        cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
        synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        duration: 154,
      },
      {
        id: 5,
        title: 'The Dark Knight',
        year: 2008,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Dark+Knight',
        rating: 9.0,
        genres: ['Action', 'Crime', 'Drama'],
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
        synopsis: 'When the menace known as the Joker wreaks havoc on Gotham City, Batman must accept one of the greatest psychological and physical tests.',
        duration: 152,
      },
      {
        id: 6,
        title: 'Fight Club',
        year: 1999,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Fight+Club',
        rating: 8.8,
        genres: ['Drama'],
        director: 'David Fincher',
        cast: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter'],
        synopsis: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
        duration: 139,
      },
      {
        id: 7,
        title: 'Forrest Gump',
        year: 1994,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Forrest+Gump',
        rating: 8.8,
        genres: ['Drama', 'Romance'],
        director: 'Robert Zemeckis',
        cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
        synopsis: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
        duration: 142,
      },
      {
        id: 8,
        title: 'Goodfellas',
        year: 1990,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Goodfellas',
        rating: 8.7,
        genres: ['Biography', 'Crime', 'Drama'],
        director: 'Martin Scorsese',
        cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'],
        synopsis: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill.',
        duration: 146,
      },
      {
        id: 9,
        title: 'The Shawshank Redemption',
        year: 1994,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Shawshank+Redemption',
        rating: 9.3,
        genres: ['Drama'],
        director: 'Frank Darabont',
        cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
        synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        duration: 142,
      },
      {
        id: 10,
        title: 'The Godfather',
        year: 1972,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Godfather',
        rating: 9.2,
        genres: ['Crime', 'Drama'],
        director: 'Francis Ford Coppola',
        cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
        synopsis: 'An aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        duration: 175,
      },
      {
        id: 11,
        title: '12 Angry Men',
        year: 1957,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=12+Angry+Men',
        rating: 9.0,
        genres: ['Crime', 'Drama'],
        director: 'Sidney Lumet',
        cast: ['Henry Fonda', 'Lee J. Cobb', 'Martin Balsam'],
        synopsis: 'A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.',
        duration: 96,
      },
      {
        id: 12,
        title: 'Schindler\'s List',
        year: 1993,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Schindlers+List',
        rating: 9.0,
        genres: ['Biography', 'Drama', 'History'],
        director: 'Steven Spielberg',
        cast: ['Liam Neeson', 'Ralph Fiennes', 'Ben Kingsley'],
        synopsis: 'In German-occupied Poland during World War II, industrialist Oskar Schindler saves his Jewish employees.',
        duration: 195,
      },
      {
        id: 13,
        title: 'The Lord of the Rings: The Return of the King',
        year: 2003,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=LOTR+Return+King',
        rating: 9.0,
        genres: ['Action', 'Adventure', 'Drama'],
        director: 'Peter Jackson',
        cast: ['Elijah Wood', 'Viggo Mortensen', 'Ian McKellen'],
        synopsis: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam.',
        duration: 201,
      },
      {
        id: 14,
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        year: 2001,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=LOTR+Fellowship',
        rating: 8.8,
        genres: ['Action', 'Adventure', 'Drama'],
        director: 'Peter Jackson',
        cast: ['Elijah Wood', 'Ian McKellen', 'Orlando Bloom'],
        synopsis: 'A meek Hobbit and eight companions set out on a journey to destroy the One Ring.',
        duration: 178,
      },
      {
        id: 15,
        title: 'Star Wars: Episode V - The Empire Strikes Back',
        year: 1980,
        poster_url: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Empire+Strikes+Back',
        rating: 8.7,
        genres: ['Action', 'Adventure', 'Fantasy'],
        director: 'Irvin Kershner',
        cast: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher'],
        synopsis: 'After the Rebels are brutally overpowered by the Empire, Luke Skywalker trains with Jedi Master Yoda.',
        duration: 124,
      },
    ];

    // Simulate pagination
    const total = allMockMovies.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMovies = allMockMovies.slice(startIndex, endIndex);

    return {
      data: paginatedMovies,
      total: total,
      page: page,
      totalPages: totalPages,
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