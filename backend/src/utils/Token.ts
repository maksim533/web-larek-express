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
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '10m' },
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
};

export default generateTokens;
