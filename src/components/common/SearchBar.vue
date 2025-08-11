<script lang="ts">
export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Search...',
    },
    size: {
      type: String,
      default: 'default',
      validator: (value: string) => ['default', 'small', 'large'].includes(value),
    },
  },
  emits: ['update:modelValue', 'search', 'clear'],
  data() {
    return {
      localValue: this.modelValue,
      sizeClasses: {
        small: 'py-3 px-4 pr-12 text-base',
        default: 'py-4 px-6 pr-12 text-lg',
        large: 'py-5 px-8 pr-14 text-xl',
      },
      buttonSizeClasses: {
        small: 'right-2 p-2',
        default: 'right-3 p-2',
        large: 'right-4 p-3',
      },
    };
  },
  watch: {
    modelValue(newValue) {
      this.localValue = newValue;
    },
    localValue(newValue) {
      this.$emit('update:modelValue', newValue);
      // Removed debounced search - now only triggers on button click or Enter
    },
  },
  methods: {
    handleSubmit() {
      this.$emit('search', this.localValue);
    },
    handleClear() {
      this.localValue = '';
      this.$emit('clear');
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        this.handleSubmit();
      } else if (event.key === 'Escape') {
        this.handleClear();
      }
    },
  },
};
</script>

<template>
  <div class="relative">
    <input
      v-model="localValue"
      type="text"
      :placeholder="placeholder"
      :class="[
        'w-full bg-background border border-border rounded text-textPrimary focus:ring-2 focus:ring-primary focus:outline-none transition-colors',
        sizeClasses[size]
      ]"
      @keydown="handleKeydown"
    />
    
    <!-- Clear Button (when there's text) -->
    <button
      v-if="localValue"
      @click="handleClear"
      :class="[
        'absolute top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-textPrimary transition-colors',
        size === 'large' ? 'right-12' : size === 'small' ? 'right-10' : 'right-11'
      ]"
      type="button"
      title="Clear search"
    >
      <font-awesome-icon icon="times" class="text-sm" />
    </button>
    
    <!-- Search Button -->
    <button
      @click="handleSubmit"
      :class="[
        'absolute top-1/2 transform -translate-y-1/2 bg-primary hover:bg-secondary transition-colors rounded',
        buttonSizeClasses[size]
      ]"
      type="button"
      title="Search"
    >
      <font-awesome-icon icon="magnifying-glass" class="text-background" />
    </button>
  </div>
</template>