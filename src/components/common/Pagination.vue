<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5,
});

const emit = defineEmits<{
  changePage: [page: number];
}>();

const visiblePages = computed(() => {
  const pages: number[] = [];
  const start = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2));
  const end = Math.min(props.totalPages, start + props.maxVisiblePages - 1);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const showFirstPage = computed(() => visiblePages.value[0] > 1);
const showLastPage = computed(() => visiblePages.value[visiblePages.value.length - 1] < props.totalPages);
const showPrevEllipsis = computed(() => visiblePages.value[0] > 2);
const showNextEllipsis = computed(() => visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1);

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('changePage', page);
  }
}

function goToPrevious() {
  goToPage(props.currentPage - 1);
}

function goToNext() {
  goToPage(props.currentPage + 1);
}
</script>

<template>
  <div v-if="totalPages > 1" class="pagination flex items-center justify-center gap-2">
    <!-- Previous Button -->
    <button
      @click="goToPrevious"
      :disabled="currentPage <= 1"
      class="pagination-btn"
      :class="{ 'disabled': currentPage <= 1 }"
    >
      <font-awesome-icon icon="arrow-left" />
      <span class="sr-only">Previous page</span>
    </button>

    <!-- First Page -->
    <button
      v-if="showFirstPage"
      @click="() => goToPage(1)"
      class="pagination-btn"
    >
      1
    </button>

    <!-- Previous Ellipsis -->
    <span v-if="showPrevEllipsis" class="pagination-ellipsis">
      ...
    </span>

    <!-- Visible Pages -->
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="() => goToPage(page)"
      class="pagination-btn"
      :class="{ 'active': page === currentPage }"
    >
      {{ page }}
    </button>

    <!-- Next Ellipsis -->
    <span v-if="showNextEllipsis" class="pagination-ellipsis">
      ...
    </span>

    <!-- Last Page -->
    <button
      v-if="showLastPage"
      @click="() => goToPage(totalPages)"
      class="pagination-btn"
    >
      {{ totalPages }}
    </button>

    <!-- Next Button -->
    <button
      @click="goToNext"
      :disabled="currentPage >= totalPages"
      class="pagination-btn"
      :class="{ 'disabled': currentPage >= totalPages }"
    >
      <font-awesome-icon icon="arrow-right" />
      <span class="sr-only">Next page</span>
    </button>
  </div>
</template>

<style scoped>
.pagination-btn {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #374151;
  border-radius: 6px;
  color: #9CA3AF;
  transition: all 0.15s ease;
  font-size: 14px;
  font-weight: 500;
}

.pagination-btn:hover:not(.disabled) {
  background: #D97706;
  border-color: #D97706;
  color: #1F1F1F;
}

.pagination-btn.active {
  background: #D97706;
  border-color: #D97706;
  color: #1F1F1F;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  color: #9CA3AF;
  padding: 0 8px;
  font-size: 14px;
}
</style>