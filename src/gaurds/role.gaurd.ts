import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.get<string>('role', context.getHandler());
        if (!requiredRole) return true;

        const request = context.switchToHttp().getRequest();
        const admin = request.admin; // set by AdminGuard

        const hierarchy: any = {
            'super_admin': 3,
            'manager': 2,
            'agent': 1
        };

        if (hierarchy[admin.role] >= hierarchy[requiredRole]) return true;
        throw new ForbiddenException('Insufficient permissions');
    }
}