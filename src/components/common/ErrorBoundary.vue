<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

interface Props {
  fallback?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fallback: 'Something went wrong. Please try refreshing the page.',
});

const hasError = ref(false);
const errorMessage = ref('');

// Capture errors from child components
onErrorCaptured((error: Error) => {
  hasError.value = true;
  errorMessage.value = error.message || props.fallback;
  console.error('ErrorBoundary caught error:', error);
  return false; // Prevent error from propagating
});

function retry() {
  hasError.value = false;
  errorMessage.value = '';
}
</script>

<template>
  <div v-if="hasError" class="error-boundary text-center py-20">
    <div class="text-textSecondary mb-4">
      <font-awesome-icon icon="exclamation-triangle" class="text-4xl mb-4" />
    </div>
    <h3 class="text-xl font-medium text-textPrimary mb-2">
      Oops! Something went wrong
    </h3>
    <p class="text-textSecondary mb-6">
      {{ errorMessage }}
    </p>
    <button
      @click="retry"
      class="bg-primary hover:bg-secondary text-background font-medium px-6 py-3 rounded transition-colors"
    >
      Try Again
    </button>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>