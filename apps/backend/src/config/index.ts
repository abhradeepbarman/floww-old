import 'dotenv/config';

const _config = {
  PORT: process.env.PORT || 8000,
  ORIGIN_FRONTEND: process.env.ORIGIN_FRONTEND || '',
  ORIGIN_BACKEND: process.env.ORIGIN_BACKEND || '',
  ACCESS_SECRET: process.env.ACCESS_SECRET || '',
  REFRESH_SECRET: process.env.REFRESH_SECRET || '',
  SESSION_SECRET: process.env.SESSION_SECRET || '',
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET || '',
};

const config = Object.freeze(_config);
export default config;
