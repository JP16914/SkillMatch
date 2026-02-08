import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { JobsController } from './jobs/jobs.controller';
import { PrismaService } from './prisma/prisma.service';

import { ResumesController } from './resumes/resumes.controller';
import { StorageService } from './storage/storage.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    MarketplaceModule,
    ProfileModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, JobsController, ResumesController],
  providers: [AuthService, UsersService, PrismaService, StorageService, JwtStrategy],
})
export class AppModule { }
