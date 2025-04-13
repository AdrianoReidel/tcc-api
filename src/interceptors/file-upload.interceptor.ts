import { Injectable, BadRequestException, UnsupportedMediaTypeException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Injectable()
export class FileUploadInterceptor {
  static create(maxSizeMB: number) {
    return FileInterceptor('image', {
      storage: multer.memoryStorage(),
      limits: { fileSize: maxSizeMB * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new UnsupportedMediaTypeException('Formato de arquivo não suportado. Envie um PNG, JPG ou WEBP.'),
            false,
          );
        }
        cb(null, true);
      },
    });
  }
}
