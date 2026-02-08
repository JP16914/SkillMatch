import { Controller, Get, Put, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) { }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user.userId);
  }

  @Put()
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@Request() req: any, @Body() profileData: any) {
    return this.profileService.updateProfile(req.user.userId, profileData);
  }

  @Post('parse-resume')
  @ApiOperation({ summary: 'Parse resume PDF and extract profile data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async parseResume(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    if (!file.originalname.endsWith('.pdf')) {
      throw new HttpException('Only PDF files are supported', HttpStatus.BAD_REQUEST);
    }

    return this.profileService.parseResume(file, req.user.userId);
  }
}
