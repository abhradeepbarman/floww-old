import 'dotenv/config';

const _config = {
  PORT: process.env.PORT || 8000,
  ORIGIN_FRONTEND: process.env.ORIGIN_FRONTEND || '',
  ACCESS_SECRET: process.env.ACCESS_SECRET || '',
  REFRESH_SECRET: process.env.REFRESH_SECRET || '',
};

const config = Object.freeze(_config);
export default config;
