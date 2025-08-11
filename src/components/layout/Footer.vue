<script lang="ts">
export default {
  name: 'Footer',
  emits: ['navigate'],
  data() {
    return {
      footerLinks: [
        { name: 'About', action: null },
        { name: 'Terms', action: null },
        { name: 'Privacy', action: null },
        { name: 'Contact', action: null },
      ],
    };
  },
  methods: {
    navigateTo(view: string) {
      this.$emit('navigate', view);
    },
    handleLinkClick(link: any) {
      if (link.action) {
        link.action();
      }
      // For now, other links are just visual
    },
  },
};
</script>

<template>
  <footer class="border-t border-border py-4 px-6">
    <div class="max-w-7xl mx-auto">
      <!-- Compact Links -->
      <div class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
        <span
          v-for="link in footerLinks"
          :key="link.name"
          @click="handleLinkClick(link)"
          class="text-textSecondary hover:text-primary transition-colors cursor-pointer"
        >
          {{ link.name }}
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Additional styles if needed */
</style>