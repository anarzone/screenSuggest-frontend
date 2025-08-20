<script lang="ts">
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import MovieGrid from '@/components/common/MovieGrid.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import movieService from '@/services/movieService';
import { formatDuration, formatRating, getPlaceholderImage } from '@/utils/helpers';
import type { MovieDetails, Movie } from '@/services/types';

export default {
  name: 'MovieDetailPage',
  components: {
    Header,
    Footer,
    MovieGrid,
    LoadingSpinner,
  },
  props: {
    movieId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      movie: null as MovieDetails | null,
      loading: false,
      error: null as string | null,
      newComment: '',
      isBookmarked: false,
      userVote: null as 'up' | 'down' | null,
    };
  },
  computed: {
    posterUrl() {
      if (!this.movie) return '';
      return this.movie.poster_url || getPlaceholderImage(this.movie.title);
    },
    formattedRating() {
      if (!this.movie || !this.movie.rating) return '0.0';
      return formatRating(this.movie.rating);
    },
    formattedDuration() {
      if (!this.movie || !this.movie.duration) return '';
      return formatDuration(this.movie.duration);
    },
    stars() {
      if (!this.movie || !this.movie.rating) return ['empty', 'empty', 'empty', 'empty', 'empty'];
      const numRating = typeof this.movie.rating === 'string' ? parseFloat(this.movie.rating) : this.movie.rating;
      const rating = numRating / 2; // Convert 10-point to 5-point scale
      const stars = [];
      
      for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
          stars.push('full');
        } else if (rating >= i - 0.5) {
          stars.push('half');
        } else {
          stars.push('empty');
        }
      }
      
      return stars;
    },
  },
  watch: {
    movieId: {
      handler() {
        this.loadMovieDetails();
      },
      immediate: true,
    },
  },
  mounted() {
    this.loadMovieDetails();
  },
  methods: {
    async loadMovieDetails() {
      this.loading = true;
      this.error = null;
      
      try {
        this.movie = await movieService.getMovieById(this.movieId);
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load movie details';
      } finally {
        this.loading = false;
      }
    },
    handleBack() {
      this.$router.back();
    },
    handleSearch(query: string) {
      this.$router.push({
        name: 'Search',
        query: { q: query }
      });
    },
    handleBookmark() {
      this.isBookmarked = !this.isBookmarked;
      // TODO: Implement actual bookmark functionality
      console.log('Bookmark toggled:', this.isBookmarked);
    },
    handleVote(voteType: 'up' | 'down') {
      if (this.userVote === voteType) {
        this.userVote = null; // Remove vote
      } else {
        this.userVote = voteType; // Set new vote
      }
      // TODO: Implement actual voting functionality
      console.log('Vote:', voteType, this.userVote);
    },
    handleSimilarMovieClick(selectedMovie: Movie) {
      this.$router.push({
        name: 'MovieDetail',
        params: { id: selectedMovie.id.toString() }
      });
    },
    handleAddComment() {
      if (!this.newComment.trim()) return;
      
      // TODO: Implement actual comment functionality
      console.log('Add comment:', this.newComment);
      this.newComment = '';
    },
    handleDirectorClick() {
      // TODO: Navigate to director page or search
      console.log('Director clicked');
    },
    handleCastClick(castMember: string) {
      // TODO: Navigate to cast member page or search
      console.log('Cast member clicked:', castMember);
    },
    handleNavigate(view: string) {
      if (view === 'home') {
        this.$router.push({ name: 'Home' });
      } else if (view === 'search') {
        this.$router.push({ name: 'Search' });
      }
    },
    handleMovieBookmark(movie: Movie) {
      // TODO: Implement bookmark functionality
      console.log('Bookmark movie:', movie.title);
    },
    getPlaceholderImage,
    formatRating,
  },
};
</script>

<template>
  <div class="movie-detail-page min-h-screen bg-background text-textPrimary">
    <!-- Header -->
    <Header
      :show-search="true"
      :sticky="true"
      variant="minimal"
      @search="handleSearch"
      @back="handleBack"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <LoadingSpinner size="large" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-textSecondary mb-4">
        <font-awesome-icon icon="exclamation-triangle" class="text-4xl mb-4" />
      </div>
      <h3 class="text-xl font-medium text-textPrimary mb-2">
        Failed to load movie details
      </h3>
      <p class="text-textSecondary mb-6">
        {{ error }}
      </p>
      <button
        @click="loadMovieDetails"
        class="bg-primary hover:bg-secondary text-background font-medium px-6 py-3 rounded transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Movie Details -->
    <div v-else-if="movie">
      <!-- Movie Detail Section -->
      <section class="py-8 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Poster Panel -->
            <div class="lg:col-span-1">
              <div class="relative group">
                <img
                  :src="posterUrl"
                  :alt="`${movie.title} movie poster`"
                  class="w-full aspect-[2/3] object-cover rounded"
                />
                <button
                  @click="handleBookmark"
                  class="absolute top-4 right-4 bg-background/80 hover:bg-primary transition-colors p-3 rounded-full"
                  :class="{ 'bg-primary text-background': isBookmarked }"
                >
                  <font-awesome-icon 
                    icon="bookmark" 
                    :class="isBookmarked ? 'text-background' : 'text-textPrimary hover:text-background'" 
                  />
                </button>
              </div>
            </div>

            <!-- Info Panel -->
            <div class="lg:col-span-2">
              <!-- Title & Year -->
              <h1 class="text-4xl font-medium text-textPrimary mb-2">
                {{ movie.title }}
              </h1>
              <p class="text-xl text-textSecondary mb-4">
                {{ movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A') }}
              </p>

              <!-- Rating & Duration -->
              <div class="flex flex-wrap items-center gap-6 mb-6">
                <div v-if="movie.rating" class="flex items-center">
                  <div class="flex mr-2">
                    <font-awesome-icon
                      v-for="(star, index) in stars"
                      :key="index"
                      icon="star"
                      :class="star === 'full' ? 'text-primary' : 'text-border'"
                    />
                  </div>
                  <span class="text-textPrimary font-medium">{{ formattedRating }}</span>
                  <span class="text-textSecondary ml-1">/10</span>
                </div>
                <div v-if="movie.duration" class="flex items-center text-textSecondary">
                  <font-awesome-icon icon="clock" class="mr-2" />
                  <span>{{ formattedDuration }}</span>
                </div>
              </div>

              <!-- Genre Tags -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  v-for="genre in movie.genres"
                  :key="genre"
                  class="bg-border text-textPrimary px-3 py-1 rounded-full text-sm"
                >
                  {{ genre }}
                </span>
              </div>

              <!-- Release Date -->
              <p v-if="movie.release_date || movie.releaseDate" class="text-textSecondary mb-6">
                <span class="font-medium">Release Date:</span> 
                {{ movie.release_date || (movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : '') }}
              </p>

              <!-- Synopsis -->
              <div v-if="movie.synopsis || movie.description" class="mb-6">
                <h2 class="text-xl font-medium text-textPrimary mb-3">Synopsis</h2>
                <p class="text-textSecondary leading-relaxed">
                  {{ movie.synopsis || movie.description }}
                </p>
              </div>

              <!-- Director & Cast -->
              <div class="mb-8">
                <div class="mb-3">
                  <span class="font-medium text-textPrimary">Director:</span>
                  <button
                    @click="handleDirectorClick"
                    class="text-primary hover:text-secondary cursor-pointer ml-2 transition-colors"
                  >
                    {{ movie.director }}
                  </button>
                </div>
                <div>
                  <span class="font-medium text-textPrimary">Cast:</span>
                  <span class="ml-2">
                    <template v-for="(actor, index) in movie.cast" :key="actor">
                      <button
                        @click="() => handleCastClick(actor)"
                        class="text-primary hover:text-secondary cursor-pointer transition-colors"
                      >
                        {{ actor }}
                      </button>
                      <span v-if="index < movie.cast.length - 1" class="text-textSecondary">, </span>
                    </template>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Actions -->
      <section class="py-8 px-6 border-t border-border">
        <div class="max-w-7xl mx-auto">
          <!-- Vote Buttons -->
          <div class="flex items-center gap-4 mb-8">
            <button
              @click="() => handleVote('up')"
              class="flex items-center gap-2 border transition-colors px-4 py-2 rounded"
              :class="userVote === 'up' ? 'bg-primary border-primary text-background' : 'bg-background border-border hover:border-primary'"
            >
              <font-awesome-icon 
                icon="thumbs-up" 
                :class="userVote === 'up' ? 'text-background' : 'text-primary'"
              />
              <span :class="userVote === 'up' ? 'text-background' : 'text-textPrimary'">
                {{ movie.votes_up || 0 }}
              </span>
            </button>
            <button
              @click="() => handleVote('down')"
              class="flex items-center gap-2 border transition-colors px-4 py-2 rounded"
              :class="userVote === 'down' ? 'bg-secondary border-secondary text-background' : 'bg-background border-border hover:border-primary'"
            >
              <font-awesome-icon 
                icon="thumbs-down" 
                :class="userVote === 'down' ? 'text-background' : 'text-textSecondary'"
              />
              <span :class="userVote === 'down' ? 'text-background' : 'text-textPrimary'">
                {{ movie.votes_down || 0 }}
              </span>
            </button>
          </div>

          <!-- Movies you might like (moved under comments) -->
          <div v-if="movie.similar_movies?.length" class="mt-12 pt-8 border-t border-border">
            <h2 class="text-2xl font-medium text-textPrimary mb-6">Movies You Might Like</h2>
            
            <!-- Responsive Grid for Similar Movies -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <div
                v-for="similarMovie in movie.similar_movies.slice(0, 10)"
                :key="similarMovie.id"
                class="movie-card group cursor-pointer"
                @click="() => handleSimilarMovieClick(similarMovie)"
              >
                <!-- Movie Poster -->
                <div class="relative overflow-hidden rounded">
                  <img
                    :src="similarMovie.poster_url || getPlaceholderImage(similarMovie.title)"
                    :alt="`${similarMovie.title} poster`"
                    class="w-full aspect-[2/3] object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <button
                    @click.stop="handleMovieBookmark(similarMovie)"
                    class="absolute top-2 right-2 bg-background/80 hover:bg-primary transition-colors p-1.5 rounded-full opacity-0 group-hover:opacity-100"
                    title="Add to Watchlist"
                  >
                    <font-awesome-icon icon="bookmark" class="text-primary hover:text-background" />
                  </button>
                </div>
                
                <!-- Movie Info -->
                <div class="mt-3">
                  <h3 class="text-textPrimary font-medium text-sm">{{ similarMovie.title }}</h3>
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-textSecondary text-xs">
                      {{ similarMovie.year || (similarMovie.releaseDate ? new Date(similarMovie.releaseDate).getFullYear() : 'N/A') }}
                    </span>
                    <div class="flex items-center">
                      <font-awesome-icon icon="star" class="text-primary text-xs mr-1" />
                      <span class="text-textSecondary text-xs">{{ formatRating(similarMovie.rating) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- Footer -->
    <Footer @navigate="handleNavigate" />
  </div>
</template>