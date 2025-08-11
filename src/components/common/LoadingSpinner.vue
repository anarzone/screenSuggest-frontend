<script setup lang="ts">
interface Props {
  size?: 'small' | 'default' | 'large';
  color?: 'primary' | 'secondary' | 'white';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  color: 'primary',
});

const sizeClasses = {
  small: 'w-4 h-4',
  default: 'w-8 h-8',
  large: 'w-12 h-12',
};

const colorClasses = {
  primary: 'border-primary',
  secondary: 'border-secondary',
  white: 'border-white',
};
</script>

<template>
  <div class="flex items-center justify-center">
    <div 
      :class="[
        'animate-spin rounded-full border-2 border-t-transparent',
        sizeClasses[size],
        colorClasses[color]
      ]"
    ></div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>