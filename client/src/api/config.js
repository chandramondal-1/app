/**
 * Centralized API configuration for SunSeating App
 * 
 * Production URL is determined by the VITE_API_BASE_URL environment variable.
 * Local URL fallbacks to your local IP or localhost.
 */

const LOCAL_IP = '192.168.0.104'; // Set this to your local dev machine IP for mobile testing
const PORT = '5000';

const PROD_URL = import.meta.env.VITE_API_BASE_URL;
const RENDER_URL = 'https://sunseating-server.onrender.com'; // Hardcoded fallback for APK builds

const getApiBaseUrl = () => {
  // 1. If we have a production URL from environment
  if (PROD_URL) {
    const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(PROD_URL);
    if (!PROD_URL.startsWith('http') && !isIp) {
      return `https://${PROD_URL}`;
    }
    return PROD_URL.startsWith('http') ? PROD_URL : `http://${PROD_URL}`;
  }

  // 2. Fallback for APK builds or Capacitor environments
  const isCapacitor = window.Capacitor || (typeof window.location !== 'undefined' && window.location.protocol === 'capacitor:');
  if (isCapacitor) {
    return RENDER_URL;
  }

  // 3. Optional: check for non-local host if not in Capacitor
  if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('192.168')) {
    return RENDER_URL;
  }

  // 4. Default to mobile/local IP for development
  return `http://${LOCAL_IP}:${PORT}`;
};

export const API_BASE_URL = getApiBaseUrl();

console.log('Final API Base URL:', API_BASE_URL);

export default API_BASE_URL;
