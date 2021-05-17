import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PassportModule } from '@nestjs/passport';
import { RbacCache, RBAcModule} from 'nestjs-rbac';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../config';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { AsyncService } from 'modules/rbac';
import User from './user.entity';
import { AuthService } from 'modules/auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    MulterModule.register({
      dest: 'files/users/avatars/upload',
    }),
    RBAcModule.useCache(RbacCache, {KEY: 'RBAC', TTL: 400}).forDynamic(AsyncService),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            ...(configService.get('JWT_EXPIRATION_TIME')
              ? {
                  expiresIn: Number(configService.get('JWT_EXPIRATION_TIME')),
                }
              : {}),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService,AuthService],
  exports: [UsersService],

})
export class UserModule {}
