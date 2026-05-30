import { Body, Controller, Delete, Get, Param, Post, Query, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { AdminGuard } from 'src/gaurds/admin.gaurd';

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }
    @Get('all')
    getAll() {
        return this.locationService.getAll();
    }

    @Get('states')
    getStates() {
        return this.locationService.getStates();
    }

    @Get('cities')
    getCities(@Query('state') state: string) {
        return this.locationService.getCitiesByState(state);
    }

    @Get('localities')
    getLocalities(@Query('city') city: string) {
        return this.locationService.getLocalitiesByCity(city);
    }


    @Post('add')
    @UseGuards(AdminGuard)
    addLocality(@Body() body: { state: string; city: string; locality: string }) {
        return this.locationService.addLocality(body.state, body.city, body.locality);
    }
    @Delete('remove/:id')
    @UseGuards(AdminGuard)
    removeLocality(@Param('id') id: string) {
        return this.locationService.remove(id);
    }
    @Get('export')
    @UseGuards(AdminGuard)
    @SetMetadata('role', 'manager')
    exportLocations(@Res() res: any) {
        return this.locationService.exportLocations(res);

    }
}
