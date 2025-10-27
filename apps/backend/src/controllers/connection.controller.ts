import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/async-handler';
import apps from '../apps';
import CustomErrorHandler from '../utils/custom-error-handler';
import { db } from '@repo/db';
import { connections } from '@repo/db/schema';
import { and, eq } from 'drizzle-orm';
import ResponseHandler from '../utils/response-handler';
import { AppStatus } from '@repo/common/types';

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

  getConnectionToken: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;
    const { app } = req.params;
    const { id } = req.user;

    if (!code) {
      return next(CustomErrorHandler.badRequest());
    }

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

    const { accessToken, refreshToken, expiresAt } = await appDetails.auth.getAuthToken(code);

    const newConnection = await db
      .insert(connections)
      .values({ userId: id, app: appDetails.key, accessToken, refreshToken, expiresAt })
      .returning();

    return res.send(ResponseHandler(200, 'Connection added successfully', newConnection));
  }),

  getAllConnections: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.user;

    const userConnections = await db.query.connections.findMany({
      where: eq(connections.userId, id),
    });

    const allApps = Object.values(apps).map(app => ({
      name: app.name,
      key: app.key,
      icon: app.icon,
      description: app.description,
      status: AppStatus.DISCONNECTED,
      expiresAt: new Date(),
    }));

    if (userConnections.length > 0) {
      allApps.forEach(app => {
        const connection = userConnections.find(c => c.app === app.key);
        if (connection) {
          app.status = connection.expiresAt.getTime() > Date.now() ? AppStatus.CONNECTED : AppStatus.EXPIRED;
          app.expiresAt = connection.expiresAt;
        }
      });
    }

    return res.send(ResponseHandler(200, 'fetch all connections', allApps));
  }),
};

export default connectionController;
