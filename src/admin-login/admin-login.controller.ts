import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { AdminLogin } from '../entities/admin-login.entity';
import { AdminLoginService } from './admin-login.service';

@Controller('admin-login')
export class AdminLoginController {
  constructor(private readonly adminLoginService: AdminLoginService) {}

  @Get()
  findAll(): Promise<AdminLogin[]> {
    return this.adminLoginService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string): Promise<AdminLogin | null> {
    return this.adminLoginService.findOne(username);
  }

  @Post('upload')
  async uploadAdminLogin(@Body() body: any) {
    // Parse JSON sent from frontend
    const adminLogin: Partial<AdminLogin> = {
      username: body.data.username,
      password: body.data.password.toString(),
    };
    return this.adminLoginService.create(adminLogin);
  }

  @Put(':username')
  update(
    @Param('username') username: string,
    @Body() adminLogin: Partial<AdminLogin>,
  ) {
    return this.adminLoginService.update(username, adminLogin);
  }

  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.adminLoginService.delete(username);
  }
}
