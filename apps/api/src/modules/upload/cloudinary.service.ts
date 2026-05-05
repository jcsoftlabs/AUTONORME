import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

export type UploadFolder = 'parts' | 'garages' | 'profiles' | 'misc';

@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key:    this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadBuffer(
    buffer: Buffer,
    folder: UploadFolder = 'misc',
    filename?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `autonorme/${folder}`,
          public_id: filename,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        },
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async deleteByUrl(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  /** Extraire le public_id depuis une URL Cloudinary */
  extractPublicId(url: string): string {
    // https://res.cloudinary.com/<cloud>/image/upload/v123/autonorme/parts/abc.jpg
    const parts = url.split('/');
    const uploadIdx = parts.indexOf('upload');
    // Sauter la version (v123)
    const afterVersion = parts.slice(uploadIdx + 2).join('/');
    return afterVersion.replace(/\.[^/.]+$/, ''); // Enlever l'extension
  }
}
