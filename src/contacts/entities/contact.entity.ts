import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryColumn()
  id: string;
  constructor() {
    this.id = this.generateTimestampId();
  }

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  mobile!: string;

  @Column('text')
  message!: string;

  @Column()
  subject!: string;

  @Column({ nullable: true })
  propertyId!: string;

  @Column()
  status!: string;

  @Column()
  from!: 'Home Page' | 'Property Page';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  generateTimestampId(): string {
    const now = new Date();
    const pad = (n: number, width: number = 2) =>
      n.toString().padStart(width, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const minute = pad(now.getMinutes());
    const second = pad(now.getSeconds());
    const ms = pad(now.getMilliseconds(), 3);

    return `T${year}${month}${day}${hour}${minute}${second}${ms}`;
  }
}
