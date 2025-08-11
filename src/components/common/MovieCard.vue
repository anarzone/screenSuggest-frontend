<script lang="ts">
import { formatRating, getPlaceholderImage } from '@/utils/helpers';
import type { Movie } from '@/services/types';

export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object as () => Movie,
      required: true,
    },
    size: {
      type: String,
      default: 'default',
      validator: (value: string) => ['small', 'default', 'large'].includes(value),
    },
  },
  emits: ['click', 'bookmark'],
  computed: {
    posterUrl() {
      return this.movie.poster_url || getPlaceholderImage(this.movie.title);
    },
    formattedRating() {
      return formatRating(this.movie.rating);
    },
    movieYear() {
      if (this.movie.year) return this.movie.year;
      if (this.movie.releaseDate) {
        return new Date(this.movie.releaseDate).getFullYear();
      }
      return 'N/A';
    },
    cardClasses() {
      const baseClasses = 'movie-card group cursor-pointer';
      const sizeClasses = {
        small: 'w-32',
        default: '',
        large: 'w-64',
      };
      
      return `${baseClasses} ${sizeClasses[this.size]}`;
    },
    imageClasses() {
      return 'w-full aspect-[2/3] object-cover transition-transform group-hover:scale-105';
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.movie);
    },
    handleBookmark(event: Event) {
      event.stopPropagation(); // Prevent card click when clicking bookmark
      this.$emit('bookmark', this.movie);
    },
  },
};
</script>

<template>
  <div :class="cardClasses" @click="handleClick">
    <!-- Movie Poster -->
    <div class="relative overflow-hidden rounded">
      <img
        :src="posterUrl"
        :alt="`${movie.title} movie poster`"
        :class="imageClasses"
        loading="lazy"
      />
      
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <!-- Bookmark Button -->
      <button
        @click="handleBookmark"
        class="absolute top-2 right-2 bg-background/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
        title="Add to bookmarks"
      >
        <font-awesome-icon 
          icon="bookmark" 
          class="text-textPrimary hover:text-background transition-colors" 
        />
      </button>
    </div>

    <!-- Movie Info -->
    <div class="mt-3">
      <h3 class="text-textPrimary font-medium truncate" :title="movie.title">
        {{ movie.title }}
      </h3>
      
      <div class="flex justify-between items-center mt-1">
        <span class="text-textSecondary text-sm">
          {{ movieYear }}
        </span>
        
        <div v-if="movie.rating" class="flex items-center">
          <font-awesome-icon 
            icon="star" 
            class="text-primary text-sm mr-1" 
          />
          <span class="text-textSecondary text-sm">
            {{ formattedRating }}
          </span>
        </div>
      </div>
      
      <!-- Genres (optional, for larger sizes) -->
      <div 
        v-if="size !== 'small' && movie.genres?.length" 
        class="flex flex-wrap gap-1 mt-2"
      >
        <span
          v-for="genre in movie.genres.slice(0, 2)"
          :key="genre"
          class="bg-border text-textPrimary px-2 py-1 rounded text-xs"
        >
          {{ genre }}
        </span>
        <span
          v-if="movie.genres.length > 2"
          class="text-textSecondary text-xs self-center"
        >
          +{{ movie.genres.length - 2 }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  transition: transform 0.2s ease;
}

.movie-card:hover {
  transform: translateY(-4px);
}

.movie-card img {
  background-color: var(--color-border);
}
</style>