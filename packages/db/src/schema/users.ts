import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import connections from './connections';

const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  refreshToken: varchar('refresh_token'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  workflows: many(users),
  connections: many(connections),
}));

export default users;
