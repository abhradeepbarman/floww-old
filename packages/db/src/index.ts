import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { connections, users } from './schema';
import workflows, { workflowRelations } from './schema/workflows';
import { userRelations } from './schema/users';
import steps, { stepRelations } from './schema/steps';
import conditions, { conditionRelations } from './schema/conditions';
import { connectionRelations } from './schema/connections';

const schema = {
  users,
  workflows,
  steps,
  conditions,
  connections,

  userRelations,
  workflowRelations,
  stepRelations,
  conditionRelations,
  connectionRelations,
};

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});
