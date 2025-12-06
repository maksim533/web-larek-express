import { Request, Response, NextFunction } from 'express';

const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = error.status || error.statusCode || 500;
  const message = error.message || 'Ошибка сервера';

  res.status(status).json({ error: message });
};

export default errorHandler;
