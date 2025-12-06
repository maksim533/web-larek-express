import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/bad-request-error';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new BadRequestError('Файл не был загружен'));
    }

    return res.status(200).send({
      fileName: `/${process.env.UPLOAD_PATH_TEMP || 'temp'}/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch (error) {
    return next(error);
  }
};

export default uploadFile;
