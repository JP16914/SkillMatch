import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus, JobLevel, JobStage } from '@prisma/client';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) { }

  async findAll(query: {
    search?: string;
    location?: string;
    remote?: string;
    level?: JobLevel;
    skill?: string;
    page?: number;
    limit?: number;
  }, userId?: string) {
    const { search, location, remote, level, skill, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'OPEN', // Use string literal to avoid enum import issues
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (remote !== undefined) {
      where.remote = remote === 'true';
    }

    if (level) {
      where.level = level;
    }

    if (skill) {
      where.skills = { has: skill };
    }

    let jobs, total;
    try {
      // Ensure pagination params are valid numbers
      const skipVal = Number(skip) || 0;
      const takeVal = Number(limit) || 10;

      // DEBUG: Log the parameters
      console.log('Finding jobs with params:', JSON.stringify(where), `skip=${skipVal}, take=${takeVal}`);

      [jobs, total] = await Promise.all([
        this.prisma.marketplaceJob.findMany({
          where,
          include: { company: true },
          skip: skipVal,
          take: takeVal,
          orderBy: { postedAt: 'desc' },
        }),
        this.prisma.marketplaceJob.count({ where }),
      ]);
    } catch (error) {
      console.error('Detailed DB Error:', error);
      // Throwing error with message so it appears in response
      throw new Error(`DB Query Failed: ${error.message}`);
    }

    // Calculate match scores if user is authenticated
    let jobsWithScores = jobs;
    if (userId) {
      const userProfile = await this.prisma.userProfile.findUnique({
        where: { userId },
      });

      if (userProfile && userProfile.skills && userProfile.skills.length > 0) {
        jobsWithScores = jobs.map(job => {
          const matchScore = this.calculateMatchScore(userProfile.skills, job.skills);
          return {
            ...job,
            matchScore,
          };
        });
      }
    }

    return {
      jobs: jobsWithScores,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  private calculateMatchScore(userSkills: string[], jobSkills: string[]): number {
    if (!userSkills || userSkills.length === 0 || !jobSkills || jobSkills.length === 0) {
      return 0;
    }

    // Normalize skills to lowercase for comparison
    const normalizedUserSkills = userSkills.map(s => s.toLowerCase());
    const normalizedJobSkills = jobSkills.map(s => s.toLowerCase());

    // Count matching skills
    const matchingSkills = normalizedUserSkills.filter(skill =>
      normalizedJobSkills.includes(skill)
    );

    // Calculate score as percentage of job skills matched
    const score = (matchingSkills.length / normalizedJobSkills.length) * 100;
    return Math.round(score);
  }

  async findOne(id: string) {
    const job = await this.prisma.marketplaceJob.findUnique({
      where: { id },
      include: { company: true },
    });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async saveJob(userId: string, jobId: string) {
    return this.prisma.savedJob.upsert({
      where: {
        userId_marketplaceJobId: {
          userId,
          marketplaceJobId: jobId,
        },
      },
      update: {},
      create: {
        userId,
        marketplaceJobId: jobId,
      },
    });
  }

  async applyToJob(userId: string, jobId: string) {
    const job = await this.prisma.marketplaceJob.findUnique({
      where: { id: jobId },
      include: { company: true },
    });
    if (!job) throw new NotFoundException('Job not found');

    // Create application record
    const application = await this.prisma.application.create({
      data: {
        userId,
        marketplaceJobId: jobId,
        stage: 'APPLIED',
      },
    });

    // Also add to user's personal job tracker (pipeline)
    await this.prisma.job.create({
      data: {
        userId,
        company: job.company.name,
        title: job.title,
        stage: 'APPLIED',
        descriptionText: job.description,
      },
    });

    return application;
  }

  async getMyApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: { company: true },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }
}
