import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import steps from './steps';
import { relations } from 'drizzle-orm';

const conditions = pgTable('conditions', {
  id: uuid('id').defaultRandom().primaryKey(),
  stepId: uuid('step_id')
    .notNull()
    .references(() => steps.id),
  field: varchar('field').notNull(),
  operator: varchar('operator').notNull(),
  value: varchar('value').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const conditionRelations = relations(conditions, ({ one }) => ({
  step: one(steps, {
    fields: [conditions.stepId],
    references: [steps.id],
  }),
}));

export default conditions;
