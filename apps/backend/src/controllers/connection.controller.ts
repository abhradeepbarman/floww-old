import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/async-handler';
import apps from '../@apps';
import CustomErrorHandler from '../utils/custom-error-handler';
import { db } from '@repo/db';
import { connections } from '@repo/db/schema';
import { and, eq } from 'drizzle-orm';
import ResponseHandler from '../utils/response-handler';

const connectionController = {
  addConnection: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { app } = req.params;
    const { id } = req.user;

    // app valid
    const appDetails = Object.values(apps).find(a => a.key === app);
    if (!appDetails) {
      return next(CustomErrorHandler.notFound('App not found'));
    }

    // user has already connection or not
    const isConnectionExist = await db.query.connections.findFirst({
      where: and(eq(connections.userId, id), eq(connections.app, appDetails.key)),
    });

    if (isConnectionExist && Date.now() < isConnectionExist.expiresAt.getTime()) {
      return res.send(ResponseHandler(400, 'Connection already exist', isConnectionExist));
    }

    appDetails.auth.getAuthUrl(req, res);
    return res;
  }),
};

export default connectionController;
