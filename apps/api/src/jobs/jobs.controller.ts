import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new job application' })
  create(@Body() body: any, @Request() req: any) {
    return this.prisma.job.create({
      data: {
        ...body,
        userId: req.user.userId,
      },
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all job applications' })
  findAll(@Request() req: any) {
    return this.prisma.job.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific job by ID' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.prisma.job.findFirst({
      where: { id, userId: req.user.userId },
    });
  }
}
