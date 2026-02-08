import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) { }

  async getProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return null;
    }

    return profile;
  }

  async updateProfile(userId: string, profileData: any) {
    const {
      firstName,
      lastName,
      username,
      phone,
      location,
      headline,
      summary,
      links,
      skills,
      education,
      experience,
      projects,
    } = profileData;

    // Check if profile exists
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      // Update existing profile
      return this.prisma.userProfile.update({
        where: { userId },
        data: {
          firstName,
          lastName,
          username,
          phone,
          location,
          headline,
          summary,
          links,
          skills,
          education,
          experience,
          projects,
        },
      });
    } else {
      // Create new profile
      return this.prisma.userProfile.create({
        data: {
          userId,
          firstName,
          lastName,
          username,
          phone,
          location,
          headline,
          summary,
          links,
          skills,
          education,
          experience,
          projects,
        },
      });
    }
  }

  async parseResume(file: Express.Multer.File, userId: string) {
    try {
      // Upload file to storage first
      const fileKey = await this.storageService.uploadFile(file, userId);
      const fileUrl = await this.storageService.getFileUrl(fileKey);

      // Call Python matching service to parse the resume
      const matchingServiceUrl = process.env.MATCHING_SERVICE_URL || 'http://localhost:8000';

      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await axios.post(
        `${matchingServiceUrl}/parse-resume`,
        formData,
        {
          headers: formData.getHeaders(),
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      const parsedData = response.data;

      // Check if it's a scanned PDF
      if (parsedData.error === 'scanned_pdf') {
        throw new HttpException(parsedData.message, HttpStatus.BAD_REQUEST);
      }

      // Save resume record with parsed data
      await this.prisma.resume.create({
        data: {
          userId,
          fileKey,
          fileUrl,
          extractedText: parsedData.extractedText,
          parsedJson: parsedData,
        },
      });

      // Return parsed data for review
      return {
        ...parsedData,
        fileUrl,
      };
    } catch (error) {
      console.error('Error parsing resume:', error);

      if (error.response?.status === 400) {
        throw new HttpException(
          error.response.data.detail || 'Invalid PDF file',
          HttpStatus.BAD_REQUEST
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to parse resume. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
