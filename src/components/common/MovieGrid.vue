<script setup lang="ts">
import { computed } from 'vue';
import MovieCard from './MovieCard.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import type { Movie } from '@/services/types';

interface Props {
  movies: Movie[];
  loading?: boolean;
  error?: string | null;
  columns?: 'auto' | 2 | 3 | 4 | 5 | 6;
  cardSize?: 'small' | 'default' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  columns: 'auto',
  cardSize: 'default',
});

const emit = defineEmits<{
  movieClick: [movie: Movie];
  movieBookmark: [movie: Movie];
}>();

const gridClasses = computed(() => {
  const baseClasses = 'grid gap-4';
  
  if (props.columns === 'auto') {
    // Responsive grid based on card size
    const responsiveClasses = {
      small: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10',
      default: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      large: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };
    return `${baseClasses} ${responsiveClasses[props.cardSize]}`;
  }
  
  // Fixed columns
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };
  
  return `${baseClasses} ${columnClasses[props.columns]}`;
});

const hasMovies = computed(() => props.movies.length > 0);

function handleMovieClick(movie: Movie) {
  emit('movieClick', movie);
}

function handleMovieBookmark(movie: Movie) {
  emit('movieBookmark', movie);
}
</script>

<template>
  <div class="movie-grid">
    <!-- Loading State -->
    <div v-if="loading && !hasMovies" class="flex justify-center items-center py-12">
      <LoadingSpinner size="large" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-textSecondary mb-4">
        <font-awesome-icon icon="exclamation-triangle" class="text-4xl mb-4" />
      </div>
      <h3 class="text-xl font-medium text-textPrimary mb-2">
        Something went wrong
      </h3>
      <p class="text-textSecondary">
        {{ error }}
      </p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasMovies && !loading" class="text-center py-12">
      <div class="text-textSecondary mb-4">
        <font-awesome-icon icon="film" class="text-4xl mb-4" />
      </div>
      <h3 class="text-xl font-medium text-textPrimary mb-2">
        No movies found
      </h3>
      <p class="text-textSecondary">
        Try adjusting your search criteria or filters
      </p>
    </div>

    <!-- Movies Grid -->
    <div v-else :class="gridClasses">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        :size="cardSize"
        @click="handleMovieClick"
        @bookmark="handleMovieBookmark"
      />
    </div>

    <!-- Loading More Indicator -->
    <div v-if="loading && hasMovies" class="flex justify-center items-center py-8">
      <LoadingSpinner />
    </div>
  </div>
</template>

<style scoped>
.movie-grid {
  min-height: 200px;
}
</style>