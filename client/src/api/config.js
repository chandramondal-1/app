/**
 * Centralized API configuration for SunSeating App
 * 
 * Production URL is determined by the VITE_API_BASE_URL environment variable.
 * Local URL fallbacks to your local IP or localhost.
 */

const LOCAL_IP = '192.168.0.104'; // Your local IP for testing
const PORT = '5000';

// vite-plugin env handling
const PROD_URL = import.meta.env.VITE_API_BASE_URL;

const URLS = {
  local: `http://localhost:${PORT}`,
  mobile: `http://${LOCAL_IP}:${PORT}`
};

// Use the environment variable if it exists (for production), otherwise use the local fallback
export const API_BASE_URL = PROD_URL || URLS.mobile;

console.log('API Base URL:', API_BASE_URL);

export default API_BASE_URL;
