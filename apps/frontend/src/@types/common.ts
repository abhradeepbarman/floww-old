import type { AppStatus } from '@repo/common/types';

export interface CommonResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface App {
  name: string;
  key: string;
  icon: string;
  status: AppStatus;
  description: string;
  expiresAt: string;
}

export interface Connection {
  accessToken: string;
  app: string;
  createdAt: string;
  expiresAt: string;
  id: string;
  refreshToken: string;
  updatedAt: string;
  userId: string;
}
