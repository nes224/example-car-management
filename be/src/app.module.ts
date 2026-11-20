import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';
import { TypeOrmModule} from '@nestjs/typeorm'
import { ConfigModule, ConfigService} from '@nestjs/config'
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: true,
        extra: {
          max: Number(config.get('DB_POOL_MAX') ?? 10),
          min: 2,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 500,
        }
      }),
    }),
    CarsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
