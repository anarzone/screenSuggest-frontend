<script>
export default {
  name: 'App',
  watch: {
    '$route'() {
      // Update document title based on route
      this.updateDocumentTitle();
      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  mounted() {
    this.updateDocumentTitle();
  },
  methods: {
    updateDocumentTitle() {
      const routeTitles = {
        'Home': 'ScreenSuggest - Discover Your Next Favorite Movie',
        'Search': 'Search Results - ScreenSuggest',
        'MovieDetail': 'Movie Details - ScreenSuggest',
      };
      
      const routeName = this.$route.name;
      document.title = routeTitles[routeName] || routeTitles.Home;
    },
  },
};
</script>

<template>
  <div id="app" class="min-h-screen bg-background text-textPrimary">
    <RouterView />
  </div>
</template>

<style>
/* Component-specific styles can be added here if needed */
</style>
