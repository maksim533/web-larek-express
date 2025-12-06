import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import productsRoute from './routes/product';
import orderRoute from './routes/order';
import notFound from './middleware/not-found-error';
import errorHandler from './middleware/error-handler';
import logger from './middleware/logger';
import userRoute from './routes/user';
import fileRoute from './routes/file';
import './utils/clenupTemp';

dotenv.config();
const { PORT } = process.env || 3000;
const { ORIGIN_ALLOW } = process.env || 'http://localhost:5173';
const app = express();
app.use(logger.requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: `${ORIGIN_ALLOW}`,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  }),
);

mongoose.connect(process.env.DB_ADDRESS!);

app.use(express.static(path.join('public')));

app.use('/product', productsRoute);
app.use('/order', orderRoute);
app.use('/auth', userRoute);
app.use('/upload', fileRoute);

app.use(notFound);
app.use(errors());
app.use(logger.errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.consoleLogger.info('Server listening on Port', PORT);
});
