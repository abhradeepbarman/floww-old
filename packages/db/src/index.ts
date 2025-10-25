import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { users } from './schema';

const schema = {
  users,
};

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});
