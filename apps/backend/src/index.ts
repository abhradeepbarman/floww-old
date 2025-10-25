import express, { Application, Request, Response } from 'express';
import config from './config';

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Floww API',
  });
});

app.listen(config.PORT, () => {
  console.log(`Server is running on PORT ${config.PORT}`);
});
