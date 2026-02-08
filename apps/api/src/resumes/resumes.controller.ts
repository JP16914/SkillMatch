import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { StorageService } from '../storage/storage.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Resumes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(
    private storageService: StorageService,
    private prisma: PrismaService
  ) { }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a resume PDF' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    try {
      const userId = req.user.userId;
      console.log('Uploading resume for user:', userId);

      const fileKey = await this.storageService.uploadFile(file, userId);
      const fileUrl = await this.storageService.getFileUrl(fileKey);

      return await this.prisma.resume.create({
        data: {
          userId: userId,
          fileKey: fileKey,
          fileUrl: fileUrl,
        },
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      throw error;
    }
  }
}
