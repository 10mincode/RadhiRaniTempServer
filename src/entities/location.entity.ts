import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PropertyLocation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    state!: string;

    @Column()
    city!: string;

    @Column()
    locality!: string;
}