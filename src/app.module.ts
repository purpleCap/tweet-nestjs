import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TweetModule } from './tweet/tweet.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { PaginationModule } from './common/pagination/pagination.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeGuard } from './auth/guards/authorize.guards';
import authConfig from './auth/config/auth.config';
import { JwtModule } from '@nestjs/jwt';

const ENV = (process.env.NODE_ENV)?.trim()

@Module({
  imports: [UserModule, TweetModule, AuthModule, ProfileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV == "DEVELOPMENT" ? '.env.development' : ENV == "STAGING" ? '.env.staging' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: ENV == 'DEVELOPMENT', // it automatically creates DB schemas into the application. It can be destructive in production. It may remove everything in production database.
        autoLoadEntities: configService.get('AUTO_LOAD') == 'true', // it automatically creates table in the DB; all we need to do is to import it using TypeOrmModule.forFeature([Entity]) in the corrosponding module
        // entities: [User],
      })
    }),
    HashtagModule,
    PaginationModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider())
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AuthorizeGuard
  }],
})
export class AppModule { }
