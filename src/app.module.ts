import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Property } from './entities/property.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyModule } from './property/property.module';
import { AdminLoginController } from './admin-login/admin-login.controller';
import { AdminLoginModule } from './admin-login/admin-login.module';
import { AdminLogin } from './entities/admin-login.entity';
import { ContactsModule } from './contacts/contacts.module';
import { Contact } from './contacts/entities/contact.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'radharani.db', // ek file banegi
      entities: [Property, AdminLogin, Contact],
      synchronize: true, // dev mode me ON (prod me OFF karna)
    }),
    PropertyModule,
    AdminLoginModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
