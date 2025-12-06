import { Router } from 'express';
import uploadFile from '../controllers/upload';
import fileMiddleware from '../middleware/file';
import auth from '../middleware/auth';

const fileRouter = Router();

fileRouter.post('/', auth, fileMiddleware.single('file'), uploadFile);

export default fileRouter;
