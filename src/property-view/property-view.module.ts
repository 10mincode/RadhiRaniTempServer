import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyView } from 'src/entities/property-view.entity';
import { PropertyViewService } from './property-view.service';
import { PropertyViewController } from './property-view.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PropertyView])],
    providers: [PropertyViewService],
    controllers: [PropertyViewController],
})
export class PropertyViewModule { }
