import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminLogin } from '../entities/admin-login.entity';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rrhomes-secret-key';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AdminLogin)
        private adminRepo: Repository<AdminLogin>,
    ) { }

    // Change login to accept response object
    // Change login to accept response object
    async login(username: string, password: string, res: any) {
        console.log('AuthService login called with:', username);
        const admin = await this.adminRepo.findOne({ where: { username } });
        if (!admin) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await admin.validatePassword(password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');
        console.log('AuthService login successful for:', username);
        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role, name: admin.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('AuthService login completed with token:', token);
        res.cookie('token', token, {
            httpOnly: true,    // JS can't read it
            secure: process.env.NODE_ENV === 'production',      // HTTPS only
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // cross-origin (Vercel → Render)
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        console.log('AuthService login cookie set');
        return { role: admin.role, name: admin.name };
    }
    async createAdmin(data: { username: string, password: string, role: string, name: string }) {
        const existing = await this.adminRepo.findOne({ where: { username: data.username } });
        if (existing) throw new BadRequestException('Username already exists');

        const admin = this.adminRepo.create(data);
        return this.adminRepo.save(admin);
    }

    async getAllAdmins() {
        const admins = await this.adminRepo.find();
        return admins.map(({ password, ...rest }) => rest);
    }

    async deleteAdmin(id: number) {
        const admin = await this.adminRepo.findOne({ where: { id } });
        if (admin?.role === 'super_admin') throw new BadRequestException('Cannot delete super admin');
        await this.adminRepo.delete(id);
        return { deleted: true };
    }

    async seedAdmin() {
        const existing = await this.adminRepo.findOne({ where: { username: process.env.ADMIN_USERNAME } });
        if (!existing) {
            await this.adminRepo.save(
                this.adminRepo.create({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD,
                    role: 'super_admin',
                    name: process.env.ADMIN_NAME
                })
            );
            console.log('Default admin seeded');
        }
    }

}