import { ref, onMounted } from 'vue';
import movieService from '@/services/movieService';
import type { Genre } from '@/services/types';

export function useGenres() {
  const genres = ref<Genre[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadGenres() {
    loading.value = true;
    error.value = null;

    try {
      genres.value = await movieService.getGenres();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load genres';
      genres.value = [];
    } finally {
      loading.value = false;
    }
  }

  // Load genres on mount
  onMounted(() => {
    loadGenres();
  });

  return {
    genres,
    loading,
    error,
    loadGenres,
  };
}