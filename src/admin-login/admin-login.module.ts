import { Module } from '@nestjs/common';
import { AdminLoginService } from './admin-login.service';
import { AdminLoginController } from './admin-login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLogin } from 'src/entities/admin-login.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminLogin])],
  providers: [AdminLoginService],
  controllers: [AdminLoginController],
})
export class AdminLoginModule {}
