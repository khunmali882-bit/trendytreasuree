/**
 * Central API configuration for TrendyTreasure
 */

// Use environment variable for production, fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('API Base URL:', API_BASE_URL);
