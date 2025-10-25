import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import users from './users';
import { relations } from 'drizzle-orm';
import steps from './steps';

const workflows = pgTable('workflows', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workflowRelations = relations(workflows, ({ one, many }) => ({
  user: one(users, {
    fields: [workflows.userId],
    references: [users.id],
  }),
  steps: many(steps),
}));

export default workflows;
