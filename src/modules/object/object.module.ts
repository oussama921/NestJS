import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PassportModule } from '@nestjs/passport';
import { RbacCache, RBAcModule} from 'nestjs-rbac';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../config';
import { AsyncService } from 'modules/rbac';
import Objet from './object.entity';
import {ObjectsController} from './object.controller';
import {ObjectsService} from './object.service';
import { AuthModule, AuthService } from 'modules/auth';


@Module({
  imports: [
    TypeOrmModule.forFeature([Objet]),
    ConfigModule,
    AuthModule
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService],
  exports: [ObjectsService],

})
export class ObjectModule {}
