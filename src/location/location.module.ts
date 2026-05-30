import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyLocation } from 'src/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyLocation])],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule { }
