interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

declare namespace Express {
  export interface Request {
    user: JWTPayload;
  }
  export interface Response {
    user: JWTPayload;
  }
}
