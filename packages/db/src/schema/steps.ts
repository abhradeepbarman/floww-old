import { jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import workflows from './workflows';
import { relations } from 'drizzle-orm';
import conditions from './conditions';

export const stepType = pgEnum('step_type', ['TRIGGER', 'ACTION']);

const steps = pgTable('steps', {
  id: uuid('id').defaultRandom().primaryKey(),
  workflowId: uuid('workflow_id')
    .notNull()
    .references(() => workflows.id),
  app: varchar('app').notNull(),
  type: stepType('type').notNull(),
  data: jsonb('data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const stepRelations = relations(steps, ({ one }) => ({
  workflow: one(workflows, {
    fields: [steps.workflowId],
    references: [workflows.id],
  }),
  conditions: one(conditions, {
    fields: [steps.id],
    references: [conditions.stepId],
  }),
}));

export default steps;
