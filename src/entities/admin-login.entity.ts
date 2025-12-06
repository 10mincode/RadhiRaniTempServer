import { Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BeforeInsert } from 'typeorm';
@Entity()
export class AdminLogin {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
