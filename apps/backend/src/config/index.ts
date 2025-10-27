import 'dotenv/config';

const _config = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ORIGIN_FRONTEND: process.env.ORIGIN_FRONTEND || '',
  ORIGIN_BACKEND: process.env.ORIGIN_BACKEND || '',
  ACCESS_SECRET: process.env.ACCESS_SECRET || '',
  REFRESH_SECRET: process.env.REFRESH_SECRET || '',
  SESSION_SECRET: process.env.SESSION_SECRET || '',
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET || '',
  DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI || '',
};

const config = Object.freeze(_config);
export default config;
