import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

interface JwtPayload {
  _id: Types.ObjectId | string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const generateTokens = (payload: JwtPayload): Tokens => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || 'some-secret-access-key',
    { expiresIn: '10m' },
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'some-secret-refresh-key',
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
};

export default generateTokens;
