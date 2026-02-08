import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobLevel } from '@prisma/client';

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private marketplaceService: MarketplaceService) { }

  @Get('jobs')
  @ApiOperation({ summary: 'Search and filter marketplace jobs' })
  findAll(
    @Query('search') search?: string,
    @Query('location') location?: string,
    @Query('remote') remote?: string,
    @Query('level') level?: JobLevel,
    @Query('skill') skill?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.marketplaceService.findAll({ search, location, remote, level, skill, page, limit });
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get details of a marketplace job' })
  findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne(id);
  }

  @Post('jobs/:id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save a job to favorites' })
  save(@Param('id') id: string, @Request() req: any) {
    return this.marketplaceService.saveJob(req.user.userId, id);
  }

  @Post('jobs/:id/apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply to a marketplace job' })
  apply(@Param('id') id: string, @Request() req: any) {
    return this.marketplaceService.applyToJob(req.user.userId, id);
  }

  @Get('applications/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my marketplace applications' })
  getMyApplications(@Request() req: any) {
    return this.marketplaceService.getMyApplications(req.user.userId);
  }
}
