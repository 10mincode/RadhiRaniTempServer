import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['token']; // from cookie
        if (!token) throw new UnauthorizedException('No token');
        try {
            request.admin = jwt.verify(token, process.env.JWT_SECRET || 'rrhomes-secret-key');
            return true;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }
}