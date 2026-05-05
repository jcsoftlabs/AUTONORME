import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { UploadController } from './upload.controller';

@Module({
  controllers: [UploadController],
  providers: [CloudinaryService],
  exports: [CloudinaryService], // Exporté pour usage dans GaragesModule, PartsModule, UsersModule...
})
export class UploadModule {}
