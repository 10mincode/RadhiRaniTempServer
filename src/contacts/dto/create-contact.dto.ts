import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  from: 'Home Page' | 'Property Page';

  @IsOptional()
  propertyId?: string;

  @IsNotEmpty()
  status: 'Pending' | 'Active' | 'Resolved';
}
