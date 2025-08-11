import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import SearchResultsPage from '@/views/SearchResultsPage.vue';
import MovieDetailPage from '@/views/MovieDetailPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchResultsPage,
    props: (route: any) => ({
      query: route.query.q || '',
      genre: route.query.genre || '',
      ratingMin: route.query.ratingMin || '',
      ratingMax: route.query.ratingMax || '',
      sortBy: route.query.sortBy || '',
      sortOrder: route.query.sortOrder || '',
      limit: route.query.limit || '20',
    }),
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetailPage,
    props: (route: any) => ({
      movieId: route.params.id,
    }),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;