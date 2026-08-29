// Fallback to localhost if no ENV var is provided
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
