import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  root(): string {
    return this.config.get('APP_URL');
  }

  // async verifyToken(request){
    
  //   const cookie =request.cookies["Authentication"];
  //   const data = await this.jwtService.verifyAsync(cookie)
  //   if(data){
  //     return data
  //   }else{
  //     throw new HttpException('FORBIDDEN.ERROR', HttpStatus.FORBIDDEN)
  //   }
  // }
}
