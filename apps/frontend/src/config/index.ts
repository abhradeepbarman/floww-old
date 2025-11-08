const _config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
};

const config = Object.freeze(_config);
export default config;
