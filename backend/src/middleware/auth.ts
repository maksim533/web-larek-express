import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import NotFound from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';
import User from '../models/user';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: Types.ObjectId
  };
}

const authJwt = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  try {
    if (!authorization && !authorization?.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Нет токена авторизации'));
    }

    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-access-key') as JwtPayload;
    } catch (error) {
      return next(new UnauthorizedError('Неверный или просроченный токен'));
    }

    const user = await User.findById(payload._id);

    if (!user) {
      return next(new NotFound('Пользователь не найден'));
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default authJwt;
