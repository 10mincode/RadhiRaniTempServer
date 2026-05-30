import { Module, OnModuleInit } from '@nestjs/common';
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
import { LocationModule } from './location/location.module';
import { PropertyViewModule } from './property-view/property-view.module';
import { PropertyLocation } from './entities/location.entity';
import { PropertyView } from './entities/property-view.entity';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler/';
@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 5 }]), // 5 requests per minute

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'radharani.db', // ek file banegi
      entities: [Property, AdminLogin, Contact, PropertyLocation, PropertyView],
      synchronize: true, // dev mode me ON (prod me OFF karna)
    }),
    PropertyModule,
    AdminLoginModule,
    ContactsModule,
    LocationModule,
    PropertyViewModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private authService: AuthService) { }
  async onModuleInit() {
    await this.authService.seedAdmin();
  }
}


