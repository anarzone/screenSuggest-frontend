<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGenres } from '@/composables/useGenres';
import { YEAR_RANGE, RATING_RANGE } from '@/utils/constants';
import type { SearchFilters } from '@/services/types';

interface Props {
  filters: SearchFilters;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateFilters: [filters: Partial<SearchFilters>];
  clear: [];
}>();

const { genres } = useGenres();

// Local filter state (temporary until Apply Filters is clicked)
const selectedGenre = ref(props.filters.genre || '');
const yearFrom = ref(props.filters.yearFrom?.toString() || props.filters.yearStart?.toString() || '');
const yearTo = ref(props.filters.yearTo?.toString() || props.filters.yearEnd?.toString() || '');
const ratingFrom = ref(props.filters.ratingFrom || props.filters.imdbRatingMin || 0);

// Rating display value
const ratingDisplay = computed(() => `${ratingFrom.value}+`);

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return selectedGenre.value || yearFrom.value || yearTo.value || ratingFrom.value > 0;
});

// Check if there are pending changes that haven't been applied
const hasPendingChanges = computed(() => {
  const currentGenre = props.filters.genre || '';
  const currentYearFrom = props.filters.yearFrom?.toString() || '';
  const currentYearTo = props.filters.yearTo?.toString() || '';
  const currentRatingFrom = props.filters.ratingFrom || 0;
  
  return selectedGenre.value !== currentGenre ||
         yearFrom.value !== currentYearFrom ||
         yearTo.value !== currentYearTo ||
         ratingFrom.value !== currentRatingFrom;
});

function applyFilters() {
  const fromYear = yearFrom.value ? parseInt(yearFrom.value) : undefined;
  const toYear = yearTo.value ? parseInt(yearTo.value) : undefined;
  
  emit('updateFilters', {
    genre: selectedGenre.value || undefined,
    yearStart: fromYear,
    yearEnd: toYear,
    imdbRatingMin: ratingFrom.value || undefined,
  });
}

function clearAllFilters() {
  selectedGenre.value = '';
  yearFrom.value = '';
  yearTo.value = '';
  ratingFrom.value = 0;
  emit('clear');
}
</script>

<template>
  <div class="movie-filters bg-background border-y border-border py-4 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Genre Filter -->
        <div class="filter-group">
          <select
            v-model="selectedGenre"
            class="bg-background border border-border text-textPrimary rounded px-4 py-2 focus:outline-none"
          >
            <option value="">All Genres</option>
            <option
              v-for="genre in genres"
              :key="genre.id"
              :value="genre.name"
            >
              {{ genre.name }}
            </option>
          </select>
        </div>

        <!-- Year Range Filter -->
        <div class="filter-group flex items-center gap-3">
          <span class="text-textSecondary text-sm">Year:</span>
          <div class="flex items-center gap-2">
            <input
              v-model="yearFrom"
              type="number"
              :min="YEAR_RANGE.MIN"
              :max="YEAR_RANGE.MAX"
              :placeholder="YEAR_RANGE.MIN.toString()"
              class="w-20 bg-background border border-border text-textPrimary rounded px-2 py-2 focus:outline-none"
            />
            <span class="text-textSecondary">-</span>
            <input
              v-model="yearTo"
              type="number"
              :min="YEAR_RANGE.MIN"
              :max="YEAR_RANGE.MAX"
              :placeholder="YEAR_RANGE.MAX.toString()"
              class="w-20 bg-background border border-border text-textPrimary rounded px-2 py-2 focus:outline-none"
            />
          </div>
        </div>

        <!-- Rating Filter -->
        <div class="filter-group flex items-center gap-3">
          <span class="text-textSecondary text-sm">Rating:</span>
          <div class="flex items-center gap-2">
            <input
              v-model="ratingFrom"
              type="range"
              :min="RATING_RANGE.MIN"
              :max="RATING_RANGE.MAX"
              step="0.1"
              class="w-32 accent-primary"
            />
            <span class="text-textPrimary min-w-[35px] text-sm">
              {{ ratingDisplay }}
            </span>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="bg-background border border-border text-textSecondary hover:border-primary hover:text-primary transition-colors px-4 py-2 rounded text-sm"
        >
          Clear Filters
        </button>

        <!-- Apply Filters Button -->
        <button 
          @click="applyFilters"
          :class="hasPendingChanges ? 'bg-primary hover:bg-secondary' : 'bg-primary/70 hover:bg-primary'"
          class="text-background font-medium px-6 py-2 rounded transition-colors ml-auto"
        >
          <font-awesome-icon icon="sliders" class="mr-2" />
          Apply Filters
          <span v-if="hasPendingChanges" class="ml-1 text-xs">•</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Custom range slider styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #374151;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #D97706;
  cursor: pointer;
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #D97706;
  cursor: pointer;
  border-radius: 50%;
  border: none;
}
</style>