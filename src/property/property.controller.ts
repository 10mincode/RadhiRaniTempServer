import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from '../entities/property.entity';
import { Express } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  findAll(): Promise<Property[]> {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Property | null> {
    return this.propertyService.findOne(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 20 },
      ],
      {
        storage: diskStorage({
          destination: './uploads', // folder where files will be saved
          filename: (_, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async uploadProperty(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @Body() body: any,
  ) {
    // Parse JSON sent from frontend
    const propertyJson = (body as any).property;
    const property = JSON.parse(propertyJson);

    // Map files to property object
    if (files.thumbnail) property.media.thumbnail = files.thumbnail[0].filename;
    if (files.images)
      property.media.images = files.images.map((f) => f.filename);

    // Compute propertyAge if yearBuilt exists
    property.propertyAge = property.features?.yearBuilt
      ? (new Date().getFullYear() - property.features.yearBuilt).toString()
      : '0';
    property.dateListed = new Date().toISOString();
    property.dateUpdated = new Date().toISOString();
    return this.propertyService.create(property);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() property: Partial<Property>) {
    property.dateUpdated = new Date().toISOString();
    return this.propertyService.update(id, property);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
