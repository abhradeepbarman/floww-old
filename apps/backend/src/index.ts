import express, { Application, NextFunction, Request, Response } from 'express';
import config from './config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './middlewares/error-handler';
import authRoutes from './routes/auth.routes';
import workflowRoutes from './routes/workflow.routes';

const app: Application = express();

/* -------------------Middlewares------------------- */
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: [config.ORIGIN_FRONTEND],
    credentials: true,
  }),
);

/* -------------------test route------------------- */
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Welcome to Floww 👋');
});

app.get('/healthcheck', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    timestamp: Date.now(),
  });
});

/* -------------------Routes----------------------- */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workflow', workflowRoutes);

/* ----------------404 not found---------------- */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: '404 not found',
  });
});

/* -------------------Custom Middleware------------------- */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

app.listen(config.PORT, () => {
  console.log(`Server is running on PORT ${config.PORT}`);
});
