import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number; // TypeORM will auto-generate
  @Column({ unique: true })
  propertyId: string;

  @Column('varchar', { length: 255 })
  propertyName: string;

  @Column('simple-json', { nullable: true }) // location group stored as JSON
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    nearbyLandmarks: string[];
  };

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  propertyType: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  dateListed: string;

  @Column({ nullable: true })
  dateUpdated: string;

  @Column('float', { nullable: true })
  actualPrice: number;

  @Column({ nullable: true })
  showcasePrice: string;

  @Column('float', { nullable: true })
  pricePerSqFt: number;

  @Column('float', { nullable: true })
  minBookingAmount: number;

  @Column({ nullable: true })
  furnishing: string;

  @Column({ nullable: true })
  facing: string;

  @Column({ nullable: true })
  propertyAge: string;

  @Column('simple-json', { nullable: true }) // legalClearances as JSON
  legalClearances: {
    reraId: string;
    approvedBy: string[];
  };

  @Column('simple-json', { nullable: true }) // features + amenities as JSON
  features: {
    bedrooms: number;
    bathrooms: number;
    areaSqFt: number;
    floor: string;
    totalFloors: number;
    yearBuilt: number;
    amenities: {
      parks: boolean;
      garden: boolean;
      swimmingPool: boolean;
      gym: boolean;
      security: boolean;
      parking: boolean;
      playArea: boolean;
      clubHouse: boolean;
      shoppingCenter: boolean;
      publicTransport: boolean;
      cCRoads: boolean;
      powerBackup: boolean;
      waterSupply: boolean;
      wideSewage: boolean;
      rainWaterHarvesting: boolean;
      fireSafety: boolean;
      smartHome: boolean;
      petFriendly: boolean;
      MovieHall: boolean;
      accessibility: string[];
    };
  };

  @Column('simple-json', { nullable: true }) // media group as JSON
  media: {
    thumbnail: string;
    images: string[];
  };
}
