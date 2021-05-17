import { Connection } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Injectable, NotAcceptableException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';
import * as crypto from 'crypto';
import { ConfigService } from '../config';
import { EmailVerification } from './email-verification.entity';
import { ForgottenPassword } from './forgotten-password.entity';
import { LoginDTO } from './dto';
import { UserResultDB } from '../user/model';
import MailingHelper from 'core/mail-helper';
import { SignUpDTO } from './dto/signup.dto';
import { UserRoleEnum } from 'modules/rbac/user-role.enum';
import User from 'modules/user/user.entity';

@Injectable()
export class AuthService {
  private emailVerificationRepository;
  private forgottenPasswordRepository;
  private userRepository;

  constructor(
    private readonly connection: Connection,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.emailVerificationRepository = this.connection.getRepository(EmailVerification);
    this.forgottenPasswordRepository = this.connection.getRepository(ForgottenPassword);
    this.userRepository = this.connection.getRepository(User);
  }

  async signUp(payload: SignUpDTO): Promise<any> {
    const email = payload["email"];
    const user = await this.userRepository
    .createQueryBuilder('users')
    .where('users.email = :email', { email })
    .getOne();

    if (user) {
      throw new HttpException('REGISTRATION.USER_ALREADY_EXIST', HttpStatus.FOUND);
    }
    // create new user
    let newUser = new User();
    newUser.email = payload.email;
    newUser.firstName = payload.firstName;
    newUser.lastName = payload.lastName;
    newUser.password = payload.password;
    newUser.phone = payload.phone;
    newUser.isBanned = false;
    newUser.acceptCGU =  payload.acceptCGU || true;
    newUser.role = payload.role;

    const errors = await validate(newUser);
    if (errors.length > 0) {
      const _errors = {user: 'User input is not valid.'};
      throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
    } else {
      const addedUser = await this.userRepository.save(newUser);
      return addedUser
    }
  }

  async verifyEmail(token: string, role: UserRoleEnum, email: string): Promise<boolean> {
    var tokenVerif = await this.emailVerificationRepository
    .createQueryBuilder('EmailVerification')
    .where('EmailVerification.emailToken = :emailToken')
    .setParameter('emailToken', token)
    .getOne();
    
    if(tokenVerif && tokenVerif.email && this._isValidToken(tokenVerif.createdAt)){
      var user = await this._makeAccountVerified(tokenVerif.email);
      
      if (user) {
        await this.emailVerificationRepository.remove(tokenVerif);
        return !!user;
      }else{
        throw new HttpException('VERIFY_EMAIL.USER_NOT_FOUND', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException('VERIFY_EMAIL.EMAIL_CODE_NOT_VALID_OR_EXPIRED', HttpStatus.FORBIDDEN);
    }
  }

  async createToken(user: UserResultDB) {
    const token = this.jwtService.sign({ id: user['id'], role: user["role"]});
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    // {
    //   expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    //   accessToken: this.jwtService.sign({ id: user['id'], role: user["role"]}),
    //   user,
    // };
  }

  async validateUser(payload: LoginDTO): Promise<any> {
    const user = await this._getByEmailAndPass(
      payload.email,
      payload.password,
    );
    if (!user) {
      throw new HttpException('LOGIN.USER_OR_PASSWORD_WRONG', HttpStatus.NOT_FOUND);
    }
    if(user.role!="ADMIN"){
      throw new HttpException('LOGIN.NOT_ADMIN_ACCOUNT', HttpStatus.FORBIDDEN);
    }
    if (user["hasVerifiedAccount"] == false) {
      throw new HttpException('LOGIN.ACCOUNT_NOT_VERIFIED', HttpStatus.FORBIDDEN);
    }
    if (user["isActive"] == false) {
      throw new HttpException('LOGIN.ACCOUNT_NOT_ACTIVATED', HttpStatus.FORBIDDEN);
    }
    if (user["isBanned"] == true) {
      throw new HttpException('LOGIN.ACCOUNT_BANNED', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async createVerificationToken(email: string): Promise<boolean> {
    var verificationToken = await this.emailVerificationRepository
    .createQueryBuilder('EmailVerification')
    .where('EmailVerification.email = :email')
    .setParameter('email', email)
    .getOne();
    // if (verificationToken && this._isValidToken(verificationToken.createdAt)){
    //   throw new HttpException('LOGIN.EMAIL_SENDED_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
    // } else
    if (verificationToken){
      verificationToken.emailToken = await this._generateVerificatinTOKEN();
      verificationToken.createdAt = new Date();
      const updatedToken = await this.emailVerificationRepository.save(verificationToken);
      return true;
    } else {
      var newVerificationToken = new EmailVerification();
      newVerificationToken.email = email;
      newVerificationToken.emailToken = await this._generateVerificatinTOKEN();
      const savedToken = await this.emailVerificationRepository.save(newVerificationToken);
      return true;
    }
  }

  async createForgottenPasswordToken(email: string): Promise<any> {
    var forgottenPasswordToken = await this.forgottenPasswordRepository
    .createQueryBuilder('ForgottenPassword')
    .where('ForgottenPassword.email = :email')
    .setParameter('email', email)
    .getOne();
    // if (forgottenPasswordToken && this._isValidToken(forgottenPasswordToken.createdAt)){
    //   throw new HttpException('LOGIN.EMAIL_SENDED_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
    // } else
    if (forgottenPasswordToken){
      forgottenPasswordToken.newPasswordToken = await this._generateVerificatinTOKEN();
      forgottenPasswordToken.createdAt = new Date();
      const updatedToken = await this.forgottenPasswordRepository.save(forgottenPasswordToken);
      return updatedToken;
    } else {
      var newForgottenPasswordToken = new ForgottenPassword();
      newForgottenPasswordToken.email = email;
      newForgottenPasswordToken.newPasswordToken = await this._generateVerificatinTOKEN();
      const savedToken = await this.forgottenPasswordRepository.save(newForgottenPasswordToken);
      return savedToken;
    }
  }

  async sendEmailVerification(email: string): Promise<boolean> {
    var verificationToken = await this.emailVerificationRepository
    .createQueryBuilder('EmailVerification')
    .where('EmailVerification.email = :email')
    .setParameter('email', email)
    .getOne();

    if(verificationToken && verificationToken.emailToken){
      return await MailingHelper.sendAccountVerificationEmail(this.configService, email, verificationToken.emailToken)
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }

  async sendEmailForgotPassword(email: string): Promise<boolean> {
    var user = await this._getByEmail(email);
    if(!user)
    throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    var token = await this.createForgottenPasswordToken(email);
    if(token && token.newPasswordToken){
      return  await MailingHelper.sendForgetPasswordEmail(this.configService, email, token.newPasswordToken)
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }

  async coverPassword(token: string, email: string, newPassword: string): Promise<boolean> {
    var isNewPasswordChanged : boolean = false;
    var forgotPassword = await this.forgottenPasswordRepository
    .createQueryBuilder('ForgottenPassword')
    .where('ForgottenPassword.newPasswordToken = :newPasswordToken')
    .setParameter('newPasswordToken', token)
    .getOne();
    if(forgotPassword && forgotPassword.email){
      isNewPasswordChanged = await this._setPassword(forgotPassword.email, newPassword);
      if (isNewPasswordChanged) {
        await this.forgottenPasswordRepository.remove(forgotPassword);
        return true;
      }else{
        return false;
      }
    } else {
      throw new HttpException('FORGOT_PASSWORD.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
    }
  }

  // PRIVATES
  private async _generateVerificatinTOKEN() {
    //Generate 10 digits number
    return await (Math.floor(Math.random() * (9000000000)) + 1000000000).toString()
  }

  private _isValidToken(createdAt: Date) {
    return (new Date().getTime() - createdAt.getTime()) / 60000 < parseInt(this.configService.get("EMAIL_TOKEN_EXPIRATION_PERIOD"), 10)
  }

  private async _getByEmail(email: string) {
    return await this.userRepository
    .createQueryBuilder('users')
    .where('users.email = :email')
    .setParameter('email', email)
    .getOne();
  }

  private async _getByEmailAndPass(email: string, password: string): Promise<UserResultDB>  {
    const passHash = crypto.createHmac('sha256', password).digest('hex');
    const user = await this.userRepository
    .createQueryBuilder('users')
    .where('users.email = :email and users.password = :password')
    .setParameter('email', email)
    .setParameter('password', passHash)
    //.leftJoinAndSelect('users.profile', 'UserProfile')
    //.leftJoinAndSelect('users.company', 'Company')
    .getOne();
    // return this._buildUserResultDB(user);
    if(user){
      delete user.password;
    }
    return user
  }

  private async _setPassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository
    .createQueryBuilder('users')
    .orWhere('users.email = :email', { email })
    .getOne();
    if(!user)
      throw new HttpException('FORGOT_PASSWORD.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    user.password = newPassword;
    await this.userRepository.save(user);
    return true;
  };

  private async _makeAccountVerified(email: string): Promise<UserResultDB> {
    const user = await this.userRepository
    .createQueryBuilder('users')
    .where('users.email = :email')
    .setParameter('email', email)
    .getOne();

    if (user) {
      user.hasVerifiedAccount = true;
      var updatedUser = await this.userRepository.save(user);
      return this._buildUserResultDB(updatedUser);
    }
  }

  private _buildUserResultDB(user: User) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      acceptCGU: user.acceptCGU,
      hasVerifiedAccount: user.hasVerifiedAccount,
      isBanned: user.isBanned,
      isActive: user.isActive,
      role: user.role,
    };
  }

  async verifyToken(request){
    
    const cookie =request.cookies["Authentication"];
    const data = await this.jwtService.verifyAsync(cookie)
    if(data){
      return data
    }else{
      throw new HttpException('FORBIDDEN.ERROR', HttpStatus.FORBIDDEN)
    }
  }

}
