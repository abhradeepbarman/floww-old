import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/async-handler';
import apps from '../apps';
import CustomErrorHandler from '../utils/custom-error-handler';
import { db } from '@repo/db';
import { connections } from '@repo/db/schema';
import { and, eq } from 'drizzle-orm';
import ResponseHandler from '../utils/response-handler';
import { AppStatus } from '@repo/common/types';
import config from '../config';

const connectionController = {
  getAuthUrl: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { app } = req.params;

    // app valid
    const appDetails = Object.values(apps).find(a => a.key === app);
    if (!appDetails) {
      return next(CustomErrorHandler.notFound('App not found'));
    }

    const sessionId = req.session.id;
    const authUrl = appDetails.auth.getAuthUrl(sessionId);
    return res.send(ResponseHandler(200, 'fetch auth url', authUrl));
  }),

  getConnectionToken: async (req: Request, res: Response, next: NextFunction) => {
    const { code, state } = req.query;
    const { app } = req.params;
    try {
      if (!code || !state) {
        return next(CustomErrorHandler.badRequest());
      }

      // app valid
      const appDetails = Object.values(apps).find(a => a.key === app);
      if (!appDetails) {
        return next(CustomErrorHandler.notFound('App not found'));
      }

      let { accessToken, refreshToken, expiresAt } = await appDetails.auth.getAuthToken(code);
      expiresAt = expiresAt ? new Date(expiresAt).toDateString() : null;

      res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <body>
          <script>
            (function() {
              const data = ${JSON.stringify({ success: true, app, accessToken, refreshToken, expiresAt })};
              window.opener.postMessage(data, '${config.ORIGIN_FRONTEND}');
              window.close();
            })();
          </script>
        </body>
      </html>
    `);
    } catch {
      res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <body>
          <script>
            (function() {
              const data = ${JSON.stringify({ success: false, app })};
              window.opener.postMessage(data, '${config.ORIGIN_FRONTEND}');
              window.close();
            })();
          </script>
        </body>
      </html>
    `);
    }
  },

  addConnection: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { app } = req.params;
    const { accessToken, refreshToken, expiresAt } = req.body;
    const userId = req.user.id;

    if (!accessToken) {
      return next(CustomErrorHandler.notFound('Access token not found'));
    }

    // app valid
    const appDetails = Object.values(apps).find(a => a.key === app);
    if (!appDetails) {
      return next(CustomErrorHandler.notFound('App not found'));
    }

    const [newConnection] = await db
      .insert(connections)
      .values({
        app: appDetails.key,
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId,
      })
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
      expiresAt: null as Date | null,
    }));

    if (userConnections.length > 0) {
      allApps.forEach(app => {
        const connection = userConnections.find(c => c.app === app.key);
        if (connection) {
          app.status = connection.expiresAt
            ? connection.expiresAt.getTime() > Date.now()
              ? AppStatus.CONNECTED
              : AppStatus.EXPIRED
            : AppStatus.CONNECTED;
          app.expiresAt = connection.expiresAt ? new Date(connection.expiresAt) : null;
        }
      });
    }

    return res.send(ResponseHandler(200, 'fetch all connections', allApps));
  }),

  removeConnection: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    const { app } = req.params;

    // app valid
    const appDetails = Object.values(apps).find(a => a.key === app);
    if (!appDetails) {
      return next(CustomErrorHandler.notFound('App not found'));
    }

    // user has already connection or not
    const isConnectionExist = await db.query.connections.findFirst({
      where: and(eq(connections.userId, id), eq(connections.app, appDetails.key)),
    });

    if (!isConnectionExist) {
      return next(CustomErrorHandler.notFound('Connection not found'));
    }

    await db
      .delete(connections)
      .where(and(eq(connections.userId, id), eq(connections.app, appDetails.key)))
      .returning();

    return res.send(ResponseHandler(200, 'Connection removed successfully'));
  }),
};

export default connectionController;
