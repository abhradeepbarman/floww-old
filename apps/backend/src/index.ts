import express, { Application, Request, Response } from 'express';
import config from './config';
import { db } from '@repo/db';
import { users } from '@repo/db/schema';

const app: Application = express();

app.get('/', async (req: Request, res: Response) => {
  const result = await db.select().from(users);
  return res.send(result);
});

app.listen(config.PORT, () => {
  console.log(`Server is running on PORT ${config.PORT}`);
});
