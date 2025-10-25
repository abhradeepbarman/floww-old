import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/async-handler';
import { db } from '@repo/db';
import { workflows } from '@repo/db/schema';
import CustomErrorHandler from '../utils/custom-error-handler';
import ResponseHandler from '../utils/response-handler';

const workflowController = {
  createWorkflow: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    const body = req.body;

    const [newWorkflow] = await db
      .insert(workflows)
      .values({ name: body?.name ?? 'Untitled Workflow', userId: id })
      .returning();

    if (!newWorkflow) {
      return next(CustomErrorHandler.serverError());
    }

    return res.send(ResponseHandler(200, 'Workflow created successfully', newWorkflow));
  }),
};

export default workflowController;
