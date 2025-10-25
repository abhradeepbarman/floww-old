import { Request, Response, NextFunction } from 'express';

const asyncHandler = (
  requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export default asyncHandler;
