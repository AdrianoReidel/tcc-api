import { diskStorage } from 'multer';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

export function createDynamicFieldsUploadInterceptor() {
  return AnyFilesInterceptor({
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dest = path.join(process.env.IMAGES_PATH.toString(), 'dynamic-fields');

        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }

        cb(null, dest);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '';
        const fileBaseName = `${Date.now()}${ext}`;
        cb(null, fileBaseName);
      },
    }),
    fileFilter: (req, file, cb) => {
      cb(null, true);
    },
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  });
}
