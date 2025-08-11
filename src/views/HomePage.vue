<script lang="ts">
import SearchBar from '@/components/common/SearchBar.vue';
import MovieGrid from '@/components/common/MovieGrid.vue';
import MovieFilters from '@/components/movie/MovieFilters.vue';
import Footer from '@/components/layout/Footer.vue';
import movieService from '@/services/movieService';
import { PLACEHOLDER_IMAGES } from '@/utils/constants';
import type { Movie } from '@/services/types';

export default {
  name: 'HomePage',
  components: {
    SearchBar,
    MovieGrid,
    MovieFilters,
    Footer,
  },
  data() {
    return {
      featuredMovies: [] as Movie[],
      loadingFeatured: false,
      loadingMore: false,
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      hasMoreMovies: true,
      showAdvancedFilters: false,
      genres: [] as string[],
      loadingGenres: false,
      PLACEHOLDER_IMAGES,
      advancedFilters: {
        genre: '',
        yearFilter: '',
        ratingMin: 0,
      },
      ratingDisplay: '0',
      defaultAdvancedFilters: {
        genre: '',
        yearFilter: '',
        ratingMin: 0,
      },
    };
  },
  computed: {
    hasActiveAdvancedFilters() {
      return (
          this.advancedFilters.genre ||
          this.advancedFilters.yearFilter ||
          this.advancedFilters.ratingMin > 0
      );
    },
  },
  async mounted() {
    await Promise.all([
      this.loadFeaturedMovies(),
      this.loadGenres()
    ]);
  },
  methods: {
    async loadFeaturedMovies() {
      this.loadingFeatured = true;
      try {
        const response = await movieService.searchMoviesWithParams({
          limit: 12,
          page: this.currentPage,
        });
        
        if (this.currentPage === 1) {
          this.featuredMovies = response.movies;
        } else {
          this.featuredMovies.push(...response.movies);
        }
        
        this.totalPages = response.totalPages;
        this.hasMoreMovies = this.currentPage < response.totalPages;
      } catch (error) {
        console.error('Error loading featured movies:', error);
      } finally {
        this.loadingFeatured = false;
      }
    },
    async loadGenres() {
      this.loadingGenres = true;
      try {
        const genres = await movieService.getGenres();
        this.genres = genres.map(genre => genre.name);
      } catch (error) {
        console.error('Error loading genres:', error);
        // Fallback to hardcoded genres if API fails
        this.genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Adventure'];
      } finally {
        this.loadingGenres = false;
      }
    },
    handleMovieClick(movie: Movie) {
      // Use Vue Router to navigate to movie detail page
      this.$router.push({
        name: 'MovieDetail',
        params: { id: movie.id.toString() }
      });
    },
    handleMovieBookmark(movie: Movie) {
      // TODO: Implement bookmark functionality
      console.log('Bookmark movie:', movie.title);
    },
    handleNavigate(view: string) {
      if (view === 'search-results') {
        this.$router.push({ name: 'Search' });
      }
    },
    handleGenreClick(genre: string) {
      this.$router.push({
        name: 'Search',
        query: { genre }
      });
    },
    handleViewAllClick() {
      this.$router.push({ name: 'Search' });
    },
    toggleAdvancedFilters() {
      this.showAdvancedFilters = !this.showAdvancedFilters;
    },
    updateRatingDisplay() {
      this.ratingDisplay = this.advancedFilters.ratingMin.toString();
    },
    handleAdvancedSearch() {
      const query: any = {};
      
      // Always include the search query if provided
      if (this.searchQuery.trim()) {
        query.q = this.searchQuery.trim();
      }
      
      // Include advanced filters if they have values
      if (this.advancedFilters.genre) {
        query.genre = this.advancedFilters.genre;
      }
      if (this.advancedFilters.ratingMin > 0) {
        query.ratingMin = this.advancedFilters.ratingMin.toString();
      }
      if (this.advancedFilters.yearFilter) {
        query.year = this.advancedFilters.yearFilter;
      }
      
      // Navigate to search results with query parameters
      this.$router.push({
        name: 'Search',
        query,
      });
    },
    clearAdvancedFilters() {
      this.advancedFilters = { ...this.defaultAdvancedFilters };
      this.ratingDisplay = '0';
    },
    async loadMoreMovies() {
      if (this.loadingMore || !this.hasMoreMovies) return;
      
      this.loadingMore = true;
      try {
        this.currentPage++;
        await this.loadFeaturedMovies();
      } catch (error) {
        console.error('Error loading more movies:', error);
        this.currentPage--; // Revert on error
      } finally {
        this.loadingMore = false;
      }
    },
    getPlaceholderImage(title: string) {
      return `https://placehold.co/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title)}`;
    },
    formatRating(rating: number | string | undefined): string {
      if (rating === undefined || rating === null) return '0.0';
      const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
      if (isNaN(numRating)) return '0.0';
      return numRating.toFixed(1);
    },
  },
};
</script>

<template>
  <div class="home-page min-h-screen">
    <!-- Hero Section -->
    <section class="hero relative h-[500px] flex items-center justify-center">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background"></div>
      <img
        class="absolute inset-0 w-full h-full object-cover"
        :src="PLACEHOLDER_IMAGES.HERO_BACKGROUND"
        alt="Cinematic movie collage with dramatic lighting"
      />

      <!-- Hero Content -->
      <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-medium mb-8 text-textPrimary">
          Discover Your Next Favorite Movie
        </h1>

        <!-- Search Bar -->
        <div class="relative max-w-2xl mx-auto">
          <input
            v-model="searchQuery"
            @keydown.enter="handleAdvancedSearch"
            type="text"
            placeholder="Search for movies..."
            class="w-full bg-background/80 backdrop-blur-sm border border-border rounded py-4 px-6 pr-12 text-lg focus:ring-2 focus:ring-primary focus:outline-none text-textPrimary"
          />
          <button
            @click="handleAdvancedSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-secondary transition-colors p-2 rounded"
          >
            <font-awesome-icon icon="magnifying-glass" class="text-background" />
          </button>
        </div>

        <!-- Advanced Search Toggle -->
        <div class="mt-6 text-center">
          <button
            @click="toggleAdvancedFilters"
            class="text-textSecondary hover:text-primary transition-colors text-sm"
          >
            {{ showAdvancedFilters ? 'Hide Advanced Search' : 'Advanced Search' }}
          </button>
        </div>

        <!-- Advanced Filters (Part of Search) -->
        <div v-if="showAdvancedFilters" class="mt-6 bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6 max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Genre Filter -->
            <div>
              <label class="block text-textPrimary font-medium mb-2 text-sm">Genre</label>
              <select
                v-model="advancedFilters.genre"
                class="w-full bg-background border border-border text-textPrimary rounded px-3 py-2 focus:ring-1 focus:ring-primary focus:outline-none text-sm"
                :disabled="loadingGenres"
              >
                <option value="">{{ loadingGenres ? 'Loading Genres...' : 'All Genres' }}</option>
                <option v-for="genre in genres" :key="genre" :value="genre">
                  {{ genre }}
                </option>
              </select>
            </div>

            <!-- Release Year Filter -->
            <div>
              <label class="block text-textPrimary font-medium mb-2 text-sm">Release Year</label>
              <select
                v-model="advancedFilters.yearFilter"
                class="w-full bg-background border border-border text-textPrimary rounded px-3 py-2 focus:ring-1 focus:ring-primary focus:outline-none text-sm"
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2010s">2010s</option>
                <option value="2000s">2000s</option>
                <option value="1990s">1990s</option>
              </select>
            </div>

            <!-- IMDb Rating Filter -->
            <div>
              <label class="block text-textPrimary font-medium mb-2 text-sm">IMDb Rating</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="advancedFilters.ratingMin"
                  @input="updateRatingDisplay"
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  class="flex-1 accent-primary"
                />
                <span class="text-textPrimary text-sm min-w-[40px]">{{ ratingDisplay }}+</span>
              </div>
            </div>
          </div>

          <!-- Clear Advanced Filters -->
          <div v-if="hasActiveAdvancedFilters" class="mt-4 text-center">
            <button
              @click="clearAdvancedFilters"
              class="text-textSecondary hover:text-primary transition-colors text-sm"
            >
              Clear Advanced Filters
            </button>
          </div>
        </div>
      </div>
    </section>


    <!-- Featured Movies Section -->
    <section class="py-12 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-medium text-textPrimary">
            Featured Movies
          </h2>
          
          <button
            @click="handleViewAllClick"
            class="text-primary hover:text-secondary transition-colors font-medium"
          >
            View All →
          </button>
        </div>

        <!-- 4-Column Responsive Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="movie in featuredMovies"
            :key="movie.id"
            class="movie-card group cursor-pointer"
            @click="handleMovieClick(movie)"
          >
            <!-- Movie Poster -->
            <div class="relative overflow-hidden rounded">
              <img
                :src="movie.poster_url || getPlaceholderImage(movie.title)"
                :alt="`${movie.title} movie poster`"
                class="w-full aspect-[2/3] object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <button
                @click.stop="handleMovieBookmark(movie)"
                class="absolute top-2 right-2 bg-background/80 hover:bg-primary transition-colors p-1.5 rounded-full opacity-0 group-hover:opacity-100"
                title="Add to Watchlist"
              >
                <font-awesome-icon icon="bookmark" class="text-primary hover:text-background" />
              </button>
            </div>
            
            <!-- Movie Info -->
            <div class="mt-3">
              <h3 class="text-textPrimary font-medium">{{ movie.title }}</h3>
              <div class="flex items-center justify-between mt-1">
                <span class="text-textSecondary text-sm">
                  {{ movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A') }}
                </span>
                <div class="flex items-center">
                  <font-awesome-icon icon="star" class="text-primary text-sm mr-1" />
                  <span class="text-textSecondary text-sm">{{ formatRating(movie.rating) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingFeatured && currentPage === 1" class="text-center py-8">
          <font-awesome-icon icon="spinner" class="animate-spin text-primary text-2xl" />
          <p class="text-textSecondary mt-2">Loading movies...</p>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreMovies && !loadingFeatured" class="text-center mt-8">
          <button
            @click="loadMoreMovies"
            :disabled="loadingMore"
            class="bg-primary hover:bg-secondary text-background font-medium px-8 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon v-if="loadingMore" icon="spinner" class="animate-spin mr-2" />
            {{ loadingMore ? 'Loading...' : 'Load More Movies' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Categories/Genres Section -->
    <section class="py-12 px-6 bg-background/50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-medium text-textPrimary mb-8 text-center">
          Browse by Genre
        </h2>
        
        <!-- Loading State for Genres -->
        <div v-if="loadingGenres" class="text-center py-8">
          <font-awesome-icon icon="spinner" class="animate-spin text-primary text-2xl" />
          <p class="text-textSecondary mt-2">Loading genres...</p>
        </div>

        <!-- Genre Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button
            v-for="genre in genres.slice(0, 12)"
            :key="genre"
            @click="handleGenreClick(genre)"
            class="bg-background border border-border hover:border-primary hover:bg-primary/10 text-textPrimary rounded-lg py-6 px-4 transition-colors group"
          >
            <div class="text-2xl mb-2 group-hover:text-primary transition-colors">
              🎬
            </div>
            <div class="font-medium">{{ genre }}</div>
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer @navigate="handleNavigate" />
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, #1F1F1F 0%, #2D2D2D 100%);
}

.hero img {
  mix-blend-mode: overlay;
  opacity: 0.3;
}

/* Ensure smooth transitions */
* {
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>