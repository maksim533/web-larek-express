import path from 'path';
import fs from 'fs';

const deleteFile = (filePath: string): void => {
  const fullPath = path.join('public', filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

export default deleteFile;
