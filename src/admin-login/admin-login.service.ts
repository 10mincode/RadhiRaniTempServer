import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminLogin } from 'src/entities/admin-login.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminLoginService {
  constructor(
    @InjectRepository(AdminLogin)
    private adminLoginRepo: Repository<AdminLogin>,
  ) {}

  findAll(): Promise<AdminLogin[]> {
    return this.adminLoginRepo.find();
  }
  findOne(username: string): Promise<AdminLogin | null> {
    return this.adminLoginRepo.findOneBy({ username: username });
  }
  create(adminLogin: Partial<AdminLogin>): Promise<AdminLogin> {
    const newAdminLogin = this.adminLoginRepo.create(adminLogin);
    return this.adminLoginRepo.save(newAdminLogin);
  }
  async update(username: string, updateData: Partial<AdminLogin>) {
    await this.adminLoginRepo.update(username, updateData);
    return this.adminLoginRepo.findOneBy({ username: username });
  }
  async delete(username: string) {
    await this.adminLoginRepo.delete({ username: username });
    return { deleted: true };
  }
}
