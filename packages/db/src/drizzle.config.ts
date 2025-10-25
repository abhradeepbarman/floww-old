import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema',
  verbose: true,
  out: './src/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
