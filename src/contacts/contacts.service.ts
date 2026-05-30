import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private contactRepository: Repository<Contact>,
  ) { }
  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return this.contactRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Contact | null> {
    return this.contactRepository.findOneBy({ id });
  }
  async findByPropId(id: string): Promise<Contact[]> {
    return this.contactRepository.find({
      where: { propertyId: id },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact | null> {
    await this.contactRepository.update(id, updateContactDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.contactRepository.delete(id);
    return { deleted: true, id: id };
  }

  async exportContacts(res: any) {
    try {
      const contacts = await this.contactRepository.find();
      const csv =
        'Name,Email,Phone,Message,PropertyId,Subject,Status,From,CreatedAt\n' +
        contacts.map((contact) => `${contact.name},${contact.email},${contact.mobile},${contact.message},${contact.propertyId},${contact.subject},${contact.status},${contact.from},${contact.createdAt}`).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="contacts.csv"');
      res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException('Error exporting contacts');
    }
  }
}
