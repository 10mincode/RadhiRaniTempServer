import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyLocation } from '../entities/location.entity';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(PropertyLocation)
        private locationRepository: Repository<PropertyLocation>,
    ) { }
    async getAll(): Promise<PropertyLocation[]> {
        const results = await this.locationRepository.createQueryBuilder('location').select('*').getRawMany();
        return results
    }

    async getStates(): Promise<string[]> {
        const results = await this.locationRepository
            .createQueryBuilder('location')
            .select('DISTINCT location.state', 'state')
            .getRawMany();
        return results.map((r) => r.state);
    }

    async getCitiesByState(state: string): Promise<string[]> {
        const results = await this.locationRepository
            .createQueryBuilder('location')
            .select('DISTINCT location.city', 'city')
            .where('location.state = :state', { state })
            .getRawMany();
        return results.map((r) => r.city);
    }

    async getLocalitiesByCity(city: string): Promise<string[]> {
        const results = await this.locationRepository
            .createQueryBuilder('location')
            .select('DISTINCT location.locality', 'locality')
            .where('location.city = :city', { city })
            .getRawMany();
        return results.map((r) => r.locality);
    }

    async addLocality(state: string, city: string, locality: string): Promise<PropertyLocation> {
        const loc = this.locationRepository.create({ state, city, locality });
        return this.locationRepository.save(loc);
    }
    async remove(id: string) {
        try {
            await this.locationRepository.delete({ id: parseInt(id) });
            return { deleted: true };
        } catch (error) {
            return { deleted: false };
        }

    }
    async exportLocations(res: any) {
        const locations = await this.locationRepository.find();
        const csv = 'State,City,Locality\n' + locations.map(l => `${l.state},${l.city},${l.locality}`).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="locations.csv"');
        res.send(csv);
    }
}