// middlewares/file.ts
import multer from 'multer';
import path from 'path';
import { Request, Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import BadRequestError from '../errors/bad-request-error';

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    const tempDir = `public/${process.env.UPLOAD_PATH_TEMP || 'temp'}/`;

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    cb(null, tempDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|bmp|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Недопустимый тип файла. Разрешены только изображения.'));
  }
};

const fileMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export default fileMiddleware;
