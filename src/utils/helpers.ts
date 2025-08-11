/**
 * Format duration from minutes to human readable format
 * @param minutes - Duration in minutes
 * @returns Formatted string like "2h 28m"
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
}

/**
 * Get placeholder image URL for movie posters
 * @param title - Movie title for placeholder text
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(title: string): string {
  const encodedTitle = encodeURIComponent(title);
  return `https://placehold.co/300x450/1a1a1a/ffffff?text=${encodedTitle}`;
}

/**
 * Format rating for display
 * @param rating - Rating number
 * @returns Formatted rating string
 */
export function formatRating(rating: number | string | undefined): string {
  if (rating === undefined || rating === null) return '0.0';
  const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  if (isNaN(numRating)) return '0.0';
  return numRating.toFixed(1);
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Debounce function to limit function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format date string for display
 * @param dateString - Date string to format
 * @returns Formatted date
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString; // Return original string if parsing fails
  }
}

/**
 * Generate stars array for rating display
 * @param rating - Rating number (0-10)
 * @returns Array of star states
 */
export function generateStars(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];
  const normalizedRating = rating / 2; // Convert 10-point scale to 5-point
  
  for (let i = 1; i <= 5; i++) {
    if (normalizedRating >= i) {
      stars.push('full');
    } else if (normalizedRating >= i - 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  
  return stars;
}