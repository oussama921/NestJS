import { ApiImplicitQueries } from 'nestjs-swagger-api-implicit-queries-decorator';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery
 } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Body,
  Request,
  Query,
  Post,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
  Res,
  Req,
  Headers
} from '@nestjs/common';

import { AuthService } from './';
import { CoverPasswordDto, LoginDTO } from './dto';
import { IResponse } from '../common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from '../common/dto/response.dto';
import { SignUpDTO } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Response } from 'express';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
@Controller('api')

export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiTags('Registration')
  @Post('verifyEmail')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  @ApiResponse({ status: 200, description: 'Successful Response' })
  public async verifyEmail(@Body() payload: VerifyEmailDto, @Request() request): Promise<IResponse> {
    try {
      let data= await this.authService.verifyToken(request)
      var isEmailVerified = await this.authService.verifyEmail(payload.token, data.role, data.email);
      return new ResponseSuccess("LOGIN.EMAIL_VERIFIED", isEmailVerified);
    } catch(error) {
      return new ResponseError("LOGIN.ERROR.EMAIL_VERIFIED", error.message);
    }
  }

  @ApiTags('Registration')
  @Get('resendVerificationToken')
  @ApiQuery({ name: "email", required: true })
  @ApiImplicitQueries([{name: 'email', type: String}])
  @ApiResponse({ status: 200, description: 'Successful Response' })
  public async sendEmailTokenVerification(@Query() params): Promise<IResponse> {
    try {
      await this.authService.createVerificationToken(params.email);
      var isEmailSent = await this.authService.sendEmailVerification(params.email);
      if(isEmailSent){
        return new ResponseSuccess("REGISTRATION.EMAIL_RESENT", null);
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error) {
      return new ResponseError("REGISTRATION.ERROR.SEND_EMAIL", error.message);
    }
  }


  // @ApiTags('Registration')
  // @Post('signUp')
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse({ status: 201, description: 'Successful Registration' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async signUp(@Body() payload: SignUpDTO): Promise<any> {
  //   let registerResponse = undefined
  //   try {
  //     const newUser = await this.authService.signUp(payload);
  //     if(await this.authService.createVerificationToken(payload["email"])){
  //       registerResponse = await this.authService.createToken(newUser);
  //       var sent = await this.authService.sendEmailVerification(newUser["email"]);
  //         if(sent){
  //           return new ResponseSuccess("REGISTRATION.USER_REGISTERED_SUCCESSFULLY", registerResponse);
  //         } else {
  //           return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
  //         }
  //     } else {
  //       return new ResponseError("REGISTRATION.ERROR.TOKEN_NOT_CREATED");
  //     }
  //   } catch(error) {
  //     if (registerResponse != undefined) {
  //       return new ResponseSuccess("REGISTRATION.ERROR.MAIL_NOT_SENT", registerResponse);
  //     }else{
  //       return new ResponseError("REGISTRATION.ERROR", error.message);
  //     }
  //   }
  // }


  @ApiTags('Auth')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginDTO, @Res() response: Response): Promise<any> {
    try {
      const user = await this.authService.validateUser(payload);
      var cookie = await this.authService.createToken(user);
      response.setHeader('Set-Cookie', cookie);
      user.auth = cookie;
      return response.send({message:"LOGIN.SUCCESS",data:user});
      // return new ResponseSuccess("LOGIN.SUCCESS", response);
    } catch(error) {
      return response.send({message:"LOGIN.ERROR", error:error.message});
    }
  }

  @ApiTags('Auth')
  @Get('forgotPassword')
  @ApiQuery({ name: "email", required: true })
  @ApiImplicitQueries([{name: 'email', type: String}])
  @ApiResponse({ status: 200, description: 'Successful Response' })
  public async sendEmailForgotPassword(@Query() params): Promise<IResponse> {
    try {
      var isEmailSent = await this.authService.sendEmailForgotPassword(params.email);
      if(isEmailSent){
        return new ResponseSuccess("LOGIN.EMAIL_RESENT", isEmailSent);
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error) {
      return new ResponseError("LOGIN.ERROR.SEND_EMAIL", error.message);
    }
  }

  @ApiTags('Auth')
  @Post('coverPassword')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async coverPassword(@Body() resetPassword: CoverPasswordDto): Promise<IResponse> {
    try {
      var isNewPasswordChanged = await this.authService.coverPassword(resetPassword.code, resetPassword.email, resetPassword.newPassword);
      return new ResponseSuccess("FORGOT_PASSWORD.PASSWORD_CHANGED", isNewPasswordChanged);
    } catch(error) {
      return new ResponseError("FORGOT_PASSWORD.CHANGE_PASSWORD_ERROR", error.message);
    }
  }

}
