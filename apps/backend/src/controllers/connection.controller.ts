import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/async-handler';

const connectionController = {
  addConnection: asyncHandler((req: Request, res: Response, next: NextFunction) => {
    const { app } = req.params;
    const { id } = req.user;
  }),
};

export default connectionController;
