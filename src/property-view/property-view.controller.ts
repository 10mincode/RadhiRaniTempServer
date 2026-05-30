import { Controller, Get, Param, Post, Req, Res, SetMetadata, UseGuards } from "@nestjs/common";
import type { Request } from 'express';
import { PropertyViewService } from "./property-view.service";
import { AdminGuard } from "src/gaurds/admin.gaurd";

@Controller('property-view')
export class PropertyViewController {
    constructor(private readonly propertyService: PropertyViewService) { }
    @Get('export')
    @UseGuards(AdminGuard)
    @SetMetadata('role', 'manager')
    exportViews(@Res() res: any) {
        return this.propertyService.exportViews(res);
    }
    @Post(':id/view')
    recordView(@Param('id') id: string, @Req() req: Request) {
        const ip = req.ip || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];
        return this.propertyService.recordView(id, ip as string, userAgent as string);
    }
    @Get('stats/all')
    @UseGuards(AdminGuard)
    @SetMetadata('role', 'manager')
    getTotalStats() {
        return this.propertyService.getTotalStats();
    }

    @Get('stats/:id')
    @UseGuards(AdminGuard)
    @SetMetadata('role', 'manager')
    getViews(@Param('id') id: string) {
        return this.propertyService.getViewStats(id);
    }




}