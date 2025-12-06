import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import ms from 'ms';
import logger from '../middleware/logger';

const TEMP_DIR = `public/${process.env.UPLOAD_PATH_TEMP || 'temp'}/`;

const cleanupTempFiles = () => {
  const now = Date.now();
  const maxAge = ms('24h');
  let totalFiles = 0;

  try {
    if (!fs.existsSync(TEMP_DIR)) {
      return;
    }

    const files = fs.readdirSync(TEMP_DIR);
    totalFiles = files.length;

    if (totalFiles === 0) {
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(TEMP_DIR, file);

      try {
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtime.getTime();

        if (fileAge > maxAge) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        logger.consoleLogger.info('Ошибка при удалении файла', fileError);
      }
    });
  } catch (error) {
    logger.consoleLogger.info('Критическая ошибка при удалении файла', error);
  }
};

cron.schedule('0 */6 * * *', cleanupTempFiles);

export default cleanupTempFiles;
