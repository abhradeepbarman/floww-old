import bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import asyncHandler from '../utils/async-handler';
import { users } from '@repo/db/schema';
import CustomErrorHandler from '../utils/custom-error-handler';
import { db } from '@repo/db';
import ResponseHandler from '../utils/response-handler';
import { authValidators } from '@repo/common/validators';

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, config.ACCESS_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id: userId }, config.REFRESH_SECRET, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
};

export const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};

const authController = {
  register: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = authValidators.registerSchema.parse(req.body);
    const { name, email, password } = body;
    let accessTokenString = '';

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return next(CustomErrorHandler.badRequest('User already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await db.transaction(async tx => {
      const [insertedUser] = await tx
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
        })
        .returning();

      if (!insertedUser) return next(CustomErrorHandler.serverError());

      const { accessToken, refreshToken } = generateTokens(insertedUser.id);
      accessTokenString = accessToken;
      setCookies(res, accessToken, refreshToken);

      const [updatedUser] = await tx
        .update(users)
        .set({ refreshToken: refreshToken })
        .where(eq(users.id, insertedUser.id))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
        });
      return [updatedUser];
    });

    if (!newUser || !newUser[0]) return next(CustomErrorHandler.serverError());

    return res.status(201).send(
      ResponseHandler(201, 'User Registered Successfully', {
        id: newUser[0].id,
        name: newUser[0].name,
        access_token: accessTokenString,
        email: newUser[0].email,
      }),
    );
  }),

  login: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = authValidators.loginSchema.parse(req.body);
    const { email, password } = body;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return next(CustomErrorHandler.notFound('User not found'));
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return next(CustomErrorHandler.wrongCredentials());
    }

    const { accessToken, refreshToken } = generateTokens(existingUser.id);

    const [updateUser] = await db
      .update(users)
      .set({
        refreshToken: refreshToken,
      })
      .where(eq(users.id, existingUser.id))
      .returning();

    setCookies(res, accessToken, refreshToken);

    return res.status(200).send(
      ResponseHandler(200, 'User logged in successfully', {
        id: updateUser?.id,
        name: updateUser?.name,
        access_token: accessToken,
        email: updateUser?.email,
      }),
    );
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const id = req.user.id;

    const [data] = await db.update(users).set({ refreshToken: null }).where(eq(users.id, id)).returning({
      id: users.id,
      name: users.name,
    });

    return res
      .status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .send(ResponseHandler(200, 'User logged out successfully', data));
  }),

  refresh: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['refresh_token'];

    if (!token) {
      return next(CustomErrorHandler.unAuthorized());
    }

    const decoded = jwt.verify(token, config.REFRESH_SECRET) as JwtPayload;

    if (!decoded) {
      return next(CustomErrorHandler.unAuthorized());
    }

    const userDetails = await db.query.users.findFirst({
      where: and(eq(users.id, decoded.id), eq(users.refreshToken, token)),
    });

    if (!userDetails) {
      return next(CustomErrorHandler.unAuthorized());
    }

    const { accessToken, refreshToken } = generateTokens(userDetails.id);

    await db.update(users).set({ refreshToken: refreshToken }).where(eq(users.id, userDetails.id));

    setCookies(res, accessToken, refreshToken);
    return res.status(200).send(
      ResponseHandler(200, 'Refresh token generated', {
        id: userDetails.id,
        name: userDetails.name,
        access_token: accessToken,
        email: userDetails.email,
      }),
    );
  }),
};

export default authController;
