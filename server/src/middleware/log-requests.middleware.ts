import { Request, Response, NextFunction } from 'express';

export function logRequest(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.path}  ${req.method}`);
  next();
}
