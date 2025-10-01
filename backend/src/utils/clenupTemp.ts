import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import ms from 'ms';

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
        console.error('Ошибка при удалении', fileError);
      }
    });
  } catch (error) {
    console.error('Критическая ошибка при очистке:', error);
  }
};

cron.schedule('0 */6 * * *', cleanupTempFiles);

export default cleanupTempFiles;
