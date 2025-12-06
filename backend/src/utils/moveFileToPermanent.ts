import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

const moveFileToPermanent = (tempFileName: string) => {
  const cleanFileName = tempFileName.startsWith(`/${process.env.UPLOAD_PATH_TEMP || 'temp'}/`)
    ? tempFileName.slice(6)
    : tempFileName;

  const tempPath = path.join('public', `${process.env.UPLOAD_PATH_TEMP || 'temp'}`, cleanFileName);
  const permanentDir = path.join('public', `${process.env.UPLOAD_PATH || 'images'}`);

  if (!fs.existsSync(permanentDir)) {
    fs.mkdirSync(permanentDir, { recursive: true });
  }

  const fileExt = path.extname(cleanFileName);
  const newFileName = `${randomUUID()}${fileExt}`;
  const permanentPath = path.join(permanentDir, newFileName);

  fs.copyFileSync(tempPath, permanentPath);

  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }

  const resultPath = `/${process.env.UPLOAD_PATH || 'images'}/${newFileName}`;
  return resultPath;
};

export default moveFileToPermanent;
