import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { sharedModules } from 'sharedModules';
import { sharedEntities } from 'entitiesData';
import { AdminModule } from './admin/admin.module';
import { CompanyModule } from './company/company.module';




@Module({
  imports: [
    ...sharedModules,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DBHOST,
      port: 5432,
      username: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      database: process.env.DATABASE,
      ssl: false,
      entities: [...sharedEntities],
      synchronize: true,
    }),
    AdminModule,
    CompanyModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { }
}
