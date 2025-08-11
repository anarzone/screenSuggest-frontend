<script lang="ts">
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import MovieFilters from '@/components/movie/MovieFilters.vue';
import MovieGrid from '@/components/common/MovieGrid.vue';
import movieService from '@/services/movieService';
import type { Movie, SearchFilters } from '@/services/types';

export default {
  name: 'SearchResultsPage',
  components: {
    Header,
    Footer,
    MovieFilters,
    MovieGrid,
  },
  props: {
    query: {
      type: String,
      default: '',
    },
    genre: {
      type: String,
      default: '',
    },
    ratingMin: {
      type: String,
      default: '',
    },
    ratingMax: {
      type: String,
      default: '',
    },
    sortBy: {
      type: String,
      default: '',
    },
    sortOrder: {
      type: String,
      default: '',
    },
    limit: {
      type: String,
      default: '20',
    },
  },
  data() {
    return {
      movies: [] as Movie[],
      loading: false,
      error: null as string | null,
      total: 0,
      currentPage: 1,
      totalPages: 1,
      isLoadingMore: false,
      hasSearched: false,
      filters: {
        query: '',
        genre: '',
        yearFrom: undefined,
        yearTo: undefined,
        ratingFrom: undefined,
        page: 1,
        limit: 20,
        sortBy: '',
        sortOrder: '',
      } as SearchFilters & { sortBy: string; sortOrder: string },
      sortOptions: [
        { value: 'title', label: 'Title' },
        { value: 'year', label: 'Year' },
        { value: 'rating', label: 'Rating' },
        { value: 'popularity', label: 'Popularity' },
      ],
    };
  },
  computed: {
    hasResults() {
      return this.movies.length > 0;
    },
    hasMorePages() {
      return this.currentPage < this.totalPages;
    },
  },
  watch: {
    $route: {
      handler(newRoute) {
        this.initializeFromRoute();
      },
      immediate: true,
    },
  },
  mounted() {
    this.initializeFromRoute();
    window.addEventListener('scroll', this.handleScroll);
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    initializeFromRoute() {
      // Update filters from route props
      this.filters.query = this.query || '';
      this.filters.genre = this.genre || '';
      this.filters.sortBy = this.sortBy || '';
      this.filters.sortOrder = this.sortOrder || '';
      this.filters.limit = parseInt(this.limit) || 20;
      
      if (this.ratingMin) {
        this.filters.ratingFrom = parseFloat(this.ratingMin);
      }
      
      // Perform search if we have query params
      if (this.query || this.genre || this.ratingMin || this.ratingMax) {
        this.performSearch();
      }
    },
    async performSearch(resetPage = true) {
      if (resetPage) {
        this.currentPage = 1;
        this.movies = [];
      }
      
      this.loading = true;
      this.error = null;
      this.hasSearched = true;
      
      try {
        const searchParams = {
          q: this.filters.query,
          genre: this.filters.genre,
          ratingMin: this.ratingMin,
          ratingMax: this.ratingMax,
          sortBy: this.filters.sortBy,
          sortOrder: this.filters.sortOrder,
          limit: this.filters.limit,
          page: this.currentPage,
        };
        
        const response = await movieService.searchMoviesWithParams(searchParams);
        
        if (resetPage) {
          this.movies = response.movies;
        } else {
          this.movies.push(...response.movies);
        }
        
        this.total = response.total;
        this.totalPages = response.totalPages || Math.ceil(response.total / this.filters.limit);
      } catch (error) {
        console.error('Search error:', error);
        this.error = 'Failed to search movies';
      } finally {
        this.loading = false;
      }
    },
    handleSearch(query: string) {
      this.filters.query = query;
      this.updateRoute();
      this.performSearch();
    },
    handleFilterUpdate(newFilters: Partial<SearchFilters>) {
      Object.assign(this.filters, newFilters);
      this.updateRoute();
      this.performSearch();
    },
    handleFilterClear() {
      this.filters = {
        query: '',
        genre: '',
        yearFrom: undefined,
        yearTo: undefined,
        ratingFrom: undefined,
        page: 1,
        limit: 20,
        sortBy: '',
        sortOrder: '',
      };
      this.updateRoute();
      this.performSearch();
    },
    handleMovieClick(movie: Movie) {
      this.$router.push({
        name: 'MovieDetail',
        params: { id: movie.id.toString() }
      });
    },
    handleMovieBookmark(movie: Movie) {
      // TODO: Implement bookmark functionality
      console.log('Bookmark movie:', movie.title);
    },
    handleBack() {
      this.$router.push({ name: 'Home' });
    },
    async handleLoadMore() {
      if (this.isLoadingMore || !this.hasMorePages) return;
      
      this.isLoadingMore = true;
      try {
        this.currentPage++;
        await this.performSearch(false);
      } finally {
        this.isLoadingMore = false;
      }
    },
    handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollTop + clientHeight >= scrollHeight - 5 && this.hasMorePages && !this.loading && !this.isLoadingMore) {
        this.handleLoadMore();
      }
    },
    handleNavigate(view: string) {
      if (view === 'home') {
        this.$router.push({ name: 'Home' });
      }
    },
    updateRoute() {
      const query: any = {};
      
      if (this.filters.query) query.q = this.filters.query;
      if (this.filters.genre) query.genre = this.filters.genre;
      if (this.filters.ratingFrom) query.ratingMin = this.filters.ratingFrom.toString();
      if (this.filters.sortBy) query.sortBy = this.filters.sortBy;
      if (this.filters.sortOrder) query.sortOrder = this.filters.sortOrder;
      if (this.filters.limit !== 20) query.limit = this.filters.limit.toString();
      
      this.$router.push({
        name: 'Search',
        query,
      });
    },
    handleSortChange(sortBy: string) {
      this.filters.sortBy = sortBy;
      this.filters.sortOrder = this.filters.sortOrder || 'asc';
      this.updateRoute();
      this.performSearch();
    },
  },
};
</script>

<template>
  <div class="search-results-page min-h-screen">
    <!-- Sticky Search Header -->
    <Header
      :show-search="true"
      :sticky="true"
      variant="minimal"
      @search="handleSearch"
      @back="handleBack"
    />

    <!-- Results Count -->
    <div class="bg-background/50 border-b border-border py-4 px-6">
      <div class="max-w-7xl mx-auto">
        <p class="text-textSecondary">
          <template v-if="loading && !hasResults">
            Searching for movies...
          </template>
          <template v-else-if="hasResults">
            Found 
            <span class="text-textPrimary font-medium">{{ total }}</span>
            {{ total === 1 ? 'movie' : 'movies' }}
            <span v-if="filters.query" class="text-primary">
              for "{{ filters.query }}"
            </span>
            <span v-if="filters.genre" class="text-primary">
              in {{ filters.genre }}
            </span>
          </template>
          <template v-else-if="error">
            Error loading results
          </template>
          <template v-else>
            No movies found
          </template>
        </p>
      </div>
    </div>

    <!-- Filters and Sorting -->
    <div class="bg-background border-b border-border">
      <!-- Sort Options -->
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-4">
            <label class="text-textSecondary text-sm">Sort by:</label>
            <select 
              v-model="filters.sortBy"
              @change="handleSortChange(filters.sortBy)"
              class="bg-background border border-border rounded px-3 py-2 text-textPrimary focus:border-primary focus:outline-none"
            >
              <option value="">Default</option>
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            
            <select 
              v-if="filters.sortBy"
              v-model="filters.sortOrder"
              @change="handleSortChange(filters.sortBy)"
              class="bg-background border border-border rounded px-3 py-2 text-textPrimary focus:border-primary focus:outline-none"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          
          <div class="text-textSecondary text-sm">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
        </div>
      </div>
      
      <!-- Filters -->
      <MovieFilters
        :filters="filters"
        @update-filters="handleFilterUpdate"
        @clear="handleFilterClear"
      />
    </div>

    <!-- Movie Results Grid -->
    <section class="py-12 px-6">
      <div class="max-w-7xl mx-auto">
        <MovieGrid
          :movies="movies"
          :loading="loading && !hasResults"
          :error="error"
          :columns="'auto'"
          :card-size="'default'"
          @movie-click="handleMovieClick"
          @movie-bookmark="handleMovieBookmark"
        />

        <!-- Load More Button -->
        <div v-if="hasResults && hasMorePages && !loading" class="flex justify-center mt-12">
          <button
            @click="handleLoadMore"
            :disabled="isLoadingMore"
            class="bg-background border border-primary text-primary hover:bg-primary hover:text-background transition-colors font-medium px-8 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <template v-if="isLoadingMore">
              <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
              Loading More...
            </template>
            <template v-else>
              Load More Movies
            </template>
          </button>
        </div>

        <!-- Infinite Scroll Loading Indicator -->
        <div v-if="isLoadingMore" class="flex justify-center items-center py-8">
          <div class="text-textSecondary">
            <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
            Loading more movies...
          </div>
        </div>

        <!-- End of Results -->
        <div v-if="hasResults && !hasMorePages && !loading" class="text-center py-8">
          <p class="text-textSecondary">
            You've reached the end of the results
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer @navigate="handleNavigate" />
  </div>
</template>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1F1F1F;
}

::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #D97706;
}

/* Smooth transitions */
.search-results-page * {
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>