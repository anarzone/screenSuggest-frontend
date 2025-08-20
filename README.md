[![Laravel Forge Site Deployment Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fforge.laravel.com%2Fsite-badges%2F4a5e7497-ff01-4766-8a43-68d2e7a13170%3Fdate%3D1%26label%3D1%26commit%3D1&style=plastic)](https://forge.laravel.com/servers/906819/sites/2823146)

# ScreenSuggest Frontend

A modern Vue.js 3 movie search and recommendation application built with TypeScript and TailwindCSS.

## Features

- 🎬 **Movie Search**: Search for movies with real-time results
- 🎯 **Advanced Filtering**: Filter by genre, year, and rating
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Dark Theme**: Beautiful dark UI with orange accent colors
- ⚡ **Fast Performance**: Built with Vue 3 Composition API and TypeScript
- 🔍 **Movie Details**: Comprehensive movie information with cast, director, and synopsis
- 💬 **Interactive Features**: Comments, ratings, and bookmarks (UI mockups)
- 🔄 **Infinite Scroll**: Load more results seamlessly

## Tech Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Icons**: Font Awesome
- **Build Tool**: Vite
- **API**: RESTful API integration with Axios

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── layout/          # Layout components (Header, Footer)
│   └── movie/           # Movie-specific components
├── views/               # Main page components
├── services/            # API services and types
├── composables/         # Vue composables for reusable logic
├── utils/               # Utility functions and constants
└── types/               # TypeScript type definitions
```

## API Integration

The application integrates with the ScreenSuggest API with environment-based URLs:

### Environment Configuration
- **Development**: `https://screensuggest.staging.api.anarzone.com`
- **Production**: `https://screensuggest.api.anarzone.com`

### API Endpoints
- **Movies**: `/movies` - Search movies with filtering
- **Genres**: `/genres` - Get available movie genres

### Search Parameters
The API supports comprehensive search and filtering:
- `q` - Search query (minimum 3 characters)
- `genre` - Filter by genre name
- `yearStart` - Filter movies from this year
- `yearEnd` - Filter movies until this year
- `imdbRatingMin` - Minimum IMDB rating
- `imdbRatingMax` - Maximum IMDB rating
- `sortBy` - Sort by: `title`, `releaseDate`, `imdbRating`
- `sortOrder` - Sort direction: `ASC` or `DESC`
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20, max: 100)

### Fallback Support
Mock data is provided for development when API is unavailable, ensuring smooth development experience.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## Features Overview

### Home Page
- Hero section with search functionality
- Featured movies grid
- Genre browsing categories

### Search Results
- Advanced filtering options (genre, year range, IMDB rating)
- URL-based parameter handling for shareable links
- Responsive movie grid layout
- Infinite scroll pagination
- Results count and search feedback
- Optimized API requests (no duplicate calls)

### Movie Details
- Comprehensive movie information
- Interactive rating and voting
- Comment system (UI mockup)
- Similar movie recommendations
- Bookmark functionality (UI mockup)

## Component Architecture

### Core Components
- **SearchBar**: Reusable search input with debouncing
- **MovieCard**: Movie poster with hover effects and metadata
- **MovieGrid**: Responsive grid layout with loading and error states
- **MovieFilters**: Advanced filtering interface
- **LoadingSpinner**: Loading indicator component
- **Pagination**: Pagination controls for large result sets

### Layout Components
- **Header**: Sticky navigation with search
- **Footer**: Site links and information

### Composables
- **useMovieSearch**: Movie search logic and state management
- **useGenres**: Genre data fetching and caching

## Styling

The application uses a custom dark theme with the following color palette:
- **Background**: `#1F1F1F`
- **Primary**: `#D97706` (Orange)
- **Secondary**: `#F59E0B` (Amber)
- **Text Primary**: `#F3F4F6` (Light Gray)
- **Text Secondary**: `#9CA3AF` (Medium Gray)
- **Border**: `#374151` (Dark Gray)

## Future Enhancements

- User authentication and profiles
- Personal movie watchlists and favorites
- Real-time comments and social features
- Movie ratings and reviews
- Advanced recommendation algorithms
- PWA support with offline functionality
