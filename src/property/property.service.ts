import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
  ) { }

  findAll(): Promise<Property[]> {
    return this.propertyRepo.find({ where: { isVisible: true }, order: { isFeatured: 'DESC', dateListed: 'DESC' } });
  }
  findAllAdmin(): Promise<Property[]> {
    return this.propertyRepo.find({ order: { isFeatured: 'DESC', dateListed: 'DESC' } });
  }

  findOne(id: string): Promise<Property | null> {
    return this.propertyRepo.findOneBy({ propertyId: id });
  }

  async create(property: Partial<Property>): Promise<Property> {
    const maxResult = await this.propertyRepo.count() + 1;

    const maxOrder = maxResult || 0;
    const newProperty = this.propertyRepo.create(property);
    return this.propertyRepo.save(newProperty);
  }

  async update(id: string, updateData: Partial<Property>) {
    await this.propertyRepo.update({ propertyId: id }, updateData);
    return this.propertyRepo.findOneBy({ propertyId: id });
  }

  async remove(id: string) {
    try {
      const property = await this.propertyRepo.findOneBy({ propertyId: id });
      if (!property) return { deleted: false, message: 'Property not found' };

      // Delete thumbnail
      if (property.media?.thumbnail) {
        const thumbnailPath = path.join(process.cwd(), 'uploads', property.media.thumbnail);
        if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
      }
      // Delete images
      if (property.media?.images?.length > 0) {
        property.media.images.forEach((img: string) => {
          const imgPath = path.join(process.cwd(), 'uploads', img);
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        });
      }

      return { deleted: true };

    } catch (error) {
      console.error('Delete error:', error);
      return { deleted: false };
    }
  }
  async exportProperties(res: any) {
    try {
      const properties = await this.propertyRepo.find();

      const csvHeaders = [
        { id: 'id', title: 'ID' },
        { id: 'propertyId', title: 'PROPERTY_ID' },
        { id: 'propertyName', title: 'PROPERTY_NAME' },

        { id: 'location.address', title: 'ADDRESS' },
        { id: 'location.city', title: 'CITY' },
        { id: 'location.locality', title: 'LOCALITY' },
        { id: 'location.state', title: 'STATE' },
        { id: 'location.postalCode', title: 'POSTAL_CODE' },
        { id: 'location.nearbyLandmarks', title: 'NEARBY_LANDMARKS' },

        { id: 'description', title: 'DESCRIPTION' },
        { id: 'propertyType', title: 'PROPERTY_TYPE' },
        { id: 'status', title: 'STATUS' },
        { id: 'dateListed', title: 'DATE_LISTED' },
        { id: 'dateUpdated', title: 'DATE_UPDATED' },

        { id: 'startingPrice', title: 'STARTING_PRICE' },
        { id: 'priceUnit', title: 'PRICE_UNIT' },
        { id: 'minBookingAmount', title: 'MIN_BOOKING_AMOUNT' },

        { id: 'propertyAge', title: 'PROPERTY_AGE' },
        { id: 'yearBuilt', title: 'YEAR_BUILT' },

        { id: 'legalClearances.reraId', title: 'RERA_ID' },
        { id: 'legalClearances.approvedBy', title: 'APPROVED_BY' },

        { id: 'amenities', title: 'AMENITIES' },

        { id: 'media.thumbnail', title: 'THUMBNAIL' },
        { id: 'media.images', title: 'IMAGES' },

        { id: 'videoUrls', title: 'VIDEO_URLS' },

        { id: 'isFeatured', title: 'IS_FEATURED' },
        { id: 'isVisible', title: 'IS_VISIBLE' },
      ];
      const csvRows = properties.map((p) => [
        p.id,
        p.propertyId,
        p.propertyName,

        p.location?.address,
        p.location?.city,
        p.location?.locality,
        p.location?.state,
        p.location?.postalCode,
        p.location?.nearbyLandmarks?.join('|'),

        p.description,
        p.propertyType,
        p.status,
        p.dateListed,
        p.dateUpdated,

        p.startingPrice,
        p.priceUnit,
        p.minBookingAmount,

        p.propertyAge,
        p.yearBuilt,

        p.legalClearances?.reraId,
        p.legalClearances?.approvedBy?.join('|'),

        p.amenities?.join('|'),

        p.media?.thumbnail,
        p.media?.images?.join('|'),

        p.videoUrls?.join('|'),

        p.isFeatured,
        p.isVisible,
      ]);
      const csv = [csvHeaders.map(header => header.title), ...csvRows].map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="properties.csv"');
      res.send('\uFEFF' + csv);
    } catch (error) {
      res.status(500).send('Error exporting properties');
    }
  }
}
