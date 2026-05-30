import { Body, Controller, Delete, Get, Param, Post, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @UseGuards(ThrottlerGuard)
    login(@Body() body: { username: string; password: string }, @Res({ passthrough: true }) res: any) {

        return this.authService.login(body.username, body.password, res);
    }
    @Post('logout')
    logout(@Res() res: any) {
        res.clearCookie('token');
        return res.json({ loggedOut: true });
    }

    @Post('create')
    @SetMetadata('role', 'super_admin')
    createAdmin(@Body() body: any) {
        return this.authService.createAdmin(body);
    }

    @Get('admins')
    @SetMetadata('role', 'super_admin')
    getAllAdmins() {
        return this.authService.getAllAdmins();
    }

    @Delete('admins/:id')
    @SetMetadata('role', 'super_admin')
    deleteAdmin(@Param('id') id: string) {
        return this.authService.deleteAdmin(+id);
    }
}