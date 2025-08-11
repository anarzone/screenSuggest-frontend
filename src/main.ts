
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faStar, 
  faBookmark, 
  faMagnifyingGlass, 
  faArrowLeft,
  faArrowRight,
  faClock,
  faThumbsUp,
  faThumbsDown,
  faSliders,
  faTimes,
  faExclamationTriangle,
  faFilm,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

// Add icons to the library
library.add(
  faStar, 
  faBookmark, 
  faMagnifyingGlass, 
  faArrowLeft,
  faArrowRight,
  faClock,
  faThumbsUp,
  faThumbsDown,
  faSliders,
  faTimes,
  faExclamationTriangle,
  faFilm,
  faSpinner
);

const app = createApp(App);

// Use router
app.use(router);

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
