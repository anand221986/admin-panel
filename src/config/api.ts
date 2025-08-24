// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://16.171.117.2:3000",
  FILE_SERVER_URL: "http://16.171.117.2",
  TIMEOUT: 30000, // 30 seconds
} as const;

// For backward compatibility
export const API_BASE_URL = API_CONFIG.BASE_URL;
export const FILE_SERVER_URL = API_CONFIG.FILE_SERVER_URL;
