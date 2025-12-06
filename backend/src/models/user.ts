import bcrypt from 'bcryptjs';
import mongoose, { model, Schema } from 'mongoose';
import UnauthorizedError from '../errors/unauthorized-error';

interface IToken {
  token: string;
  createdAt: Date;
  device?: string;
}

interface IUser {
    name: string;
    email: string;
    password: string;
    tokens: IToken[];
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.HydratedDocument<IUser>>
  removeRefreshToken: (userId: string, refreshToken: string) =>
     Promise<mongoose.HydratedDocument<IUser>>
}

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  device: {
    type: String,
    default: 'Unknown device',
  },
});

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Ё-мое',
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    select: false,
  },
  tokens: {
    type: [tokenSchema],
    select: false,
  },
});

UserSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email }).select('+password +tokens');
  if (!user) {
    return new UnauthorizedError('Неправильная почта или пароль');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return new UnauthorizedError('Неправильная почта или пароль');
  }
  return user;
});

UserSchema.static('removeRefreshToken', async function removeRefreshToken(userId: string, refreshToken: string) {
  const user = await this.findById(userId).select('+tokens');
  if (!user) {
    return null;
  }
  user.tokens = user.tokens.filter((tokenObj: IToken) => tokenObj.token !== refreshToken);
  return user.save();
});

export default model<IUser, UserModel>('user', UserSchema);
