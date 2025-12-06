import { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/not-found-error';

const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new NotFoundError(
    `Ресурс ${req.method} ${req.originalUrl} не найден`,
  );
  next(error);
};

export default notFoundHandler;
