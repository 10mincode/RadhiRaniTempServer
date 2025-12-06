import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
  ) {}

  findAll(): Promise<Property[]> {
    return this.propertyRepo.find({ order: { dateListed: 'DESC' } });
  }

  findOne(id: string): Promise<Property | null> {
    return this.propertyRepo.findOneBy({ propertyId: id });
  }

  create(property: Partial<Property>): Promise<Property> {
    const newProperty = this.propertyRepo.create(property);
    return this.propertyRepo.save(newProperty);
  }

  async update(id: string, updateData: Partial<Property>) {
    await this.propertyRepo.update(id, updateData);
    return this.propertyRepo.findOneBy({ propertyId: id });
  }

  async remove(id: string) {
    await this.propertyRepo.delete({ propertyId: id });
    return { deleted: true };
  }
}
