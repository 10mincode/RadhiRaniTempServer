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
  UseGuards,
  SetMetadata,
  Res,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from '../entities/property.entity';
import { Express } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminGuard } from 'src/gaurds/admin.gaurd';
import * as fs from 'fs';
import * as path from 'path';
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }
  @Get('export')
  @UseGuards(AdminGuard)
  @SetMetadata('role', 'manager')
  async exportProperties(@Res() res: any) {
    console.log('CONTROLLER HIT');

    return this.propertyService.exportProperties(res);
  }
  @Get('admin')
  @SetMetadata('role', 'agent')
  @UseGuards(AdminGuard)
  findAllAdmin(): Promise<Property[]> {
    return this.propertyService.findAllAdmin();
  }
  @Get()
  findAll(): Promise<Property[]> {
    return this.propertyService.findAll();
  }



  @Get(':id')
  findOne(@Param('id') id: string): Promise<Property | null> {
    return this.propertyService.findOne(id);
  }

  @Post('upload')
  @SetMetadata('role', 'super_admin')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 50 },
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

  @Put('update/:id')
  @UseGuards(AdminGuard)
  @SetMetadata('role', 'manager')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 50 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (_, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async updateProperty(
    @Param('id') id: string,
    @UploadedFiles() files: { thumbnail?: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Body() body: any,
  ) {
    const property = JSON.parse(body.property);
    const keepImages: string[] = JSON.parse(body.keepImages || '[]');
    const removedImages: string[] = JSON.parse(body.removedImages || '[]');

    // Delete removed images from disk
    removedImages.forEach(img => {
      const imgPath = path.join(process.cwd(), 'uploads', img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    // Handle thumbnail
    if (files.thumbnail) {
      // New thumbnail — delete old one
      const existing = await this.propertyService.findOne(id);
      if (existing?.media?.thumbnail) {
        const oldPath = path.join(process.cwd(), 'uploads', existing.media.thumbnail);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      property.media.thumbnail = files.thumbnail[0].filename;
    } else {
      property.media.thumbnail = body.existingThumbnail;
    }

    // Combine kept + new images
    const newImages = files.images ? files.images.map(f => f.filename) : [];
    property.media.images = [...keepImages, ...newImages];

    property.dateUpdated = new Date().toISOString();
    return this.propertyService.update(id, property);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @SetMetadata('role', 'super_admin')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
  @Put(':id/feature')
  @UseGuards(AdminGuard)
  @SetMetadata('role', 'manager')
  async toggleFeatured(@Param('id') id: string, @Body('isFeatured') isFeatured: boolean) {
    return this.propertyService.update(id, { isFeatured: isFeatured });
  }
  @Put(':id/visibility')
  @UseGuards(AdminGuard)
  @SetMetadata('role', 'manager')
  async toggleVisibility(@Param('id') id: string, @Body('isVisible') isVisible: boolean) {
    return this.propertyService.update(id, { isVisible: isVisible });
  }


}
