import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth';

import { ConfigModule, ConfigService } from '../config';
import { EmailVerification } from 'modules/auth/email-verification.entity';
import { ForgottenPassword } from 'modules/auth/forgotten-password.entity';
import { UserRole } from 'modules/rbac/user-role.entity';
import User from 'modules/user/user.entity';
import Objet from 'modules/object/object.entity';
import { ObjectModule } from 'modules/object';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule,ObjectModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          // entities: [__dirname + '../**/**.entity{.ts,.js}'],
          entities: [User, EmailVerification, ForgottenPassword, UserRole,Objet],
          synchronize: true,
          autoLoadEntities: true
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
