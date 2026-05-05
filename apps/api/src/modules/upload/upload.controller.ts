import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Query,
  UseGuards,
  Delete,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CloudinaryService, UploadFolder } from './cloudinary.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 10;

@ApiTags('upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  // ── POST /api/v1/upload ──────────────────────────────────────────────────────
  @Post()
  @ApiOperation({ summary: 'Uploader une image vers Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    enum: ['parts', 'garages', 'profiles', 'misc'],
    description: 'Dossier de destination dans Cloudinary',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `Type de fichier non supporté. Types acceptés : ${ALLOWED_MIME_TYPES.join(', ')}`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: UploadFolder = 'misc',
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const result = await this.cloudinary.uploadBuffer(file.buffer, folder);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  }

  // ── DELETE /api/v1/upload/:publicId ─────────────────────────────────────────
  @Delete()
  @ApiOperation({ summary: 'Supprimer une image de Cloudinary' })
  async deleteFile(@Body('publicId') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('publicId requis');
    }
    await this.cloudinary.deleteByUrl(publicId);
    return { message: 'Fichier supprimé avec succès' };
  }
}
