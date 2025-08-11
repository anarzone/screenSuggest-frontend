<script lang="ts">
import SearchBar from '@/components/common/SearchBar.vue';

export default {
  name: 'Header',
  components: {
    SearchBar,
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    sticky: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value: string) => ['default', 'minimal'].includes(value),
    },
  },
  emits: ['search', 'back'],
  computed: {
    headerClasses() {
      return [
        'bg-background border-b border-border',
        this.sticky ? 'sticky top-0 z-50' : '',
        this.variant === 'minimal' ? 'py-4' : 'py-6',
      ].filter(Boolean).join(' ');
    },
  },
  methods: {
    handleSearch(query: string) {
      this.$emit('search', query);
    },
    handleBack() {
      this.$emit('back');
    },
  },
};
</script>

<template>
  <header :class="headerClasses">
    <div class="px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Minimal Header (for detail pages) -->
        <template v-if="variant === 'minimal'">
          <div class="flex items-center gap-4">
            <!-- Back Button -->
            <button
              @click="handleBack"
              class="bg-background border border-border hover:bg-primary hover:text-background transition-colors p-2 rounded"
            >
              <font-awesome-icon icon="arrow-left" class="text-textPrimary hover:text-background" />
            </button>

            <!-- Search Bar -->
            <div v-if="showSearch" class="flex-1 max-w-2xl">
              <SearchBar 
                placeholder="Search for movies..."
                @search="handleSearch"
                size="small"
              />
            </div>
          </div>
        </template>

        <!-- Default Header -->
        <template v-else>
          <div v-if="showSearch" class="relative max-w-3xl mx-auto mb-6">
            <SearchBar 
              placeholder="Search for movies..."
              @search="handleSearch"
            />
          </div>
        </template>
      </div>
    </div>
  </header>
</template>