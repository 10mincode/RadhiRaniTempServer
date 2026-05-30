import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  propertyId!: string;

  @Column('varchar', { length: 255 })
  propertyName!: string;

  @Column('simple-json', { nullable: true })
  location!: {
    address: string;
    city: string;
    locality: string;
    state: string;
    postalCode: string;
    nearbyLandmarks: string[];
  };

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  propertyType!: string;

  @Column({ nullable: true })
  status!: string;

  @Column({ nullable: true })
  dateListed!: string;

  @Column({ nullable: true })
  dateUpdated!: string;

  @Column('float', { nullable: true })
  startingPrice!: number;

  @Column({ nullable: true })
  priceUnit!: string;

  @Column('float', { nullable: true })
  minBookingAmount!: number;

  @Column({ nullable: true })
  propertyAge!: string;

  @Column({ nullable: true })
  yearBuilt!: number;

  @Column('simple-json', { nullable: true })
  legalClearances!: {
    reraId: string;
    approvedBy: string[];
  };

  @Column('simple-json', { nullable: true })
  amenities!: string[];

  @Column('simple-json', { nullable: true })
  media!: {
    thumbnail: string;
    images: string[];
  };
  @Column('simple-json', { nullable: true })
  videoUrls!: string[];
  @Column({ default: false })
  isFeatured!: boolean;
  @Column({ default: true })
  isVisible!: boolean;
}