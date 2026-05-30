import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PropertyView {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    propertyId!: string;

    @Column({ nullable: true })
    ipAddress!: string;

    @Column({ nullable: true })
    userAgent!: string;

    @Column({ default: 1 })
    views!: number;

    @Column()
    lastViewedAt!: string;
}