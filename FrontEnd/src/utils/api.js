/**
 * Central API configuration for TrendyTreasure
 */

// Central API configuration: Use environment variable, fallback to '/api' for Netlify, or localhost for local development
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000');

console.log('API Base URL:', API_BASE_URL);
