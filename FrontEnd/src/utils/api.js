/**
 * Central API configuration for TrendyTreasure
 */

// Use environment variable for production, fallback to localhost for development
// Use environment variable for production, fallback to /api for Netlify, or localhost for local development
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000');

console.log('API Base URL:', API_BASE_URL);
