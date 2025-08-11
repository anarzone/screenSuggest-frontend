import { ref, reactive, computed, watch } from 'vue';
import { debounce } from '@/utils/helpers';
import { DEBOUNCE_DELAY } from '@/utils/constants';
import movieService from '@/services/movieService';
import type { Movie, SearchFilters } from '@/services/types';

export function useMovieSearch() {
  const movies = ref<Movie[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const currentPage = ref(1);
  const totalPages = ref(1);

  const filters = reactive<SearchFilters>({
    query: '',
    genre: '',
    yearFrom: undefined,
    yearTo: undefined,
    ratingFrom: undefined,
    page: 1,
    limit: 20,
  });

  const hasResults = computed(() => movies.value.length > 0);
  const hasMorePages = computed(() => currentPage.value < totalPages.value);

  // Debounced search function
  const debouncedSearch = debounce(async () => {
    await performSearch();
  }, DEBOUNCE_DELAY);

  async function performSearch(resetPage = true) {
    if (resetPage) {
      filters.page = 1;
      currentPage.value = 1;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await movieService.searchMovies({ ...filters });
      
      movies.value = response.data;
      total.value = response.total || 0;
      currentPage.value = response.page || 1;
      totalPages.value = response.totalPages || 1;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred while searching movies';
      movies.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  async function loadMore() {
    if (loading.value || !hasMorePages.value) return;

    filters.page = currentPage.value + 1;
    loading.value = true;

    try {
      const response = await movieService.searchMovies({ ...filters });
      
      // Append new movies to existing ones
      movies.value = [...movies.value, ...response.data];
      currentPage.value = response.page || currentPage.value + 1;
      totalPages.value = response.totalPages || totalPages.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred while loading more movies';
      // Reset page on error
      filters.page = currentPage.value;
    } finally {
      loading.value = false;
    }
  }

  function setQuery(query: string) {
    filters.query = query;
    debouncedSearch();
  }

  function setFilters(newFilters: Partial<SearchFilters>) {
    Object.assign(filters, newFilters);
    performSearch();
  }

  function clearFilters() {
    Object.assign(filters, {
      query: '',
      genre: '',
      yearFrom: undefined,
      yearTo: undefined,
      ratingFrom: undefined,
      page: 1,
      limit: 20,
    });
    performSearch();
  }

  // Watch for direct filter changes (for non-debounced updates)
  watch(
    () => [filters.genre, filters.yearFrom, filters.yearTo, filters.ratingFrom],
    () => {
      performSearch();
    }
  );

  return {
    movies,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    filters,
    hasResults,
    hasMorePages,
    performSearch,
  };
}