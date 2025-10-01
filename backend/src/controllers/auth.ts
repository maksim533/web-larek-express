import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ms from 'ms';
import mongoose from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import User from '../models/user';
import ConflictError from '../errors/conflict-error';
import UnauthorizedError from '../errors/unauthorized-error';
import NotFound from '../errors/not-found-error';
import generateTokens from '../utils/Token';

interface DecodedToken extends JwtPayload {
  _id: string;
}

const userController = {
  registerUser: async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(
          new ConflictError('Пользователь с таким email уже существует'),
        );
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hash,
      });

      const token = generateTokens({ _id: user._id });

      user.tokens = user.tokens || [];
      user.tokens.push({
        token: token.refreshToken,
        createdAt: new Date(),
        device: req.get('User-Agent') || 'Unknown device',
      });
      await user.save();

      res.cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: ms('7d'),
        path: '/',
      });
      return res.status(200).send({
        user: {
          email: user.email,
          name: user.name,
        },
        success: true,
        accesToken: token.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  },

  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const user = await User.findUserByCredentials(email, password);

      const token = generateTokens({ _id: user._id });

      user.tokens = user.tokens || [];
      user.tokens.push({
        token: token.refreshToken,
        createdAt: new Date(),
        device: req.get('User-Agent') || 'Unknown device',
      });
      await user.save();

      res.cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: ms('7d'),
        path: '/',
      });
      return res.status(200).send({
        user: {
          email: user.email,
          name: user.name,
        },
        success: true,
        accessToken: token.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  },

  logoutUser: async (req: Request, res:Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;

      const decoded = jwt.verify(refreshToken, 'some-secret-refresh-key') as DecodedToken;

      if (!decoded._id || !mongoose.Types.ObjectId.isValid(decoded._id)) {
        return next(new BadRequestError('Невалидный идентификатор пользователя'));
      }

      await User.removeRefreshToken(decoded._id, refreshToken);

      res.clearCookie('refreshToken', {
        path: '/',
      });

      return res.status(200).send({
        success: true,
      });
    } catch (error) {
      return next(error);
    }
  },

  getCurrentUser: async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    try {
      if (!authorization || !authorization.startsWith('Bearer ')) {
        return next(new UnauthorizedError('Необходима авторизация'));
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

      return res.status(200).send({
        user: {
          email: user.email,
          name: user.name,
        },
        success: true,
      });
    } catch (error) {
      return next(error);
    }
  },

  refreshAccessToken: async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    try {
      if (!refreshToken) {
        return next(new UnauthorizedError('Необходима авторизация'));
      }
      let payload;
      try {
        payload = jwt.verify(refreshToken, 'some-secret-refresh-key') as DecodedToken;
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          return next(new UnauthorizedError('Refresh token просрочен'));
        }
        if (error instanceof jwt.JsonWebTokenError) {
          return next(new UnauthorizedError('Невалидный refresh token'));
        }
        return next(error);
      }
      const user = await User.findById(payload._id).select('+tokens');

      if (!user) {
        return next(new NotFound('Пользователь не найден'));
      }

      const token = generateTokens({ _id: payload._id });
      user.tokens = user.tokens || [];
      user.tokens.push({
        token: token.refreshToken,
        createdAt: new Date(),
        device: req.get('User-Agent') || 'Unknown device',
      });
      await user.save();

      res.cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: ms('7d'),
        path: '/',
      });
      return res.status(200).send({
        _id: token.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
