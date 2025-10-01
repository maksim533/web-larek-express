import winston from 'winston';
import expressWinston from 'express-winston';

const logger = {
  requestLogger: expressWinston.logger({
    transports: [
      new winston.transports.File({ filename: 'request.log' }),
    ],
    format: winston.format.json(),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
  }),

  errorLogger: expressWinston.errorLogger({
    transports: [
      new winston.transports.File({ filename: 'error.log' }),
    ],
    format: winston.format.json(),
    meta: true,
  }),

  consoleLogger: winston.createLogger({
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
    ],
  }),
};

export default logger;
