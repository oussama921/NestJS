import { Connection } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Injectable, NotAcceptableException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

import { ConfigService } from '../config';
import { UserResultDB } from './model/user.result.db';
import User from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { AddUserDTO } from './dto/add-user.dto';

@Injectable()
export class UsersService {

  private userRepository;

  constructor(
    private readonly connection: Connection,
    private readonly configService: ConfigService
  ) {
    this.userRepository = this.connection.getRepository(User);
  }

  async findAll(query): Promise<any> {
    // const queryResult = await this.userRepository
    //     .createQueryBuilder('users');

    //   queryResult.where("1 = 1");

    //   if ('email' in query) {
    //     queryResult.andWhere("users.email LIKE :email", { name: `%${query.email}%` });
    //   }

    //   if ('phone' in query) {
    //     queryResult.andWhere("users.phone LIKE :phone", { phone: `%${query.phone}%` });
    //   }

    //   if ('firstName' in query) {
    //     queryResult.andWhere("users.firstName LIKE :firstName", { firstName: `%${query.firstName}%` });
    //   }

    //   if ('secondName' in query) {
    //     queryResult.andWhere("users.secondName LIKE :secondName", { secondName: `%${query.secondName}%` });
    //   }

    //   if ('lastName' in query) {
    //     queryResult.andWhere("users.lastName LIKE :lastName", { lastName: `%${query.lastName}%` });
    //   }

    //   if ('familyName' in query) {
    //     queryResult.andWhere("users.familyName LIKE :familyName", { familyName: `%${query.familyName}%` });
    //   }

    //   if ('hasVerifiedAccount' in query) {
    //     const value = query.hasVerifiedAccount.toString().toLowerCase() === "true" ? "1" : "0";
    //     queryResult.andWhere("users.hasVerifiedAccount = :hasVerifiedAccount", { hasVerifiedAccount: `${value}` });
    //   }

    //   if ('acceptCGU' in query) {
    //     const value = query.acceptCGU.toString().toLowerCase() === "true" ? "1" : "0";
    //     queryResult.andWhere("users.acceptCGU = :acceptCGU", { acceptCGU: `${value}` });
    //   }

    //   if ('isActive' in query) {
    //     const value = query.isActive.toString().toLowerCase() === "true" ? "1" : "0";
    //     queryResult.andWhere("users.isActive = :isActive", { isActive: `${value}` });
    //   }

    //   if ('isBanned' in query) {
    //     const value = query.isBanned.toString().toLowerCase() === "true" ? "1" : "0";
    //     queryResult.andWhere("users.isBanned = :isBanned", { isBanned: `${value}` });
    //   }

    //   if (!('all' in query) || query.all == false ) {
    //     queryResult.andWhere("users.isActive = 1");
    //   }

    //   queryResult.leftJoinAndSelect('users.profile', 'UserProfile')
    //   // queryResult.leftJoinAndSelect('users.company', 'Company')
    //   // queryResult.excludeSelect('users.password')

    //   if ('sort' in query) {
    //     const list = query.sort.split(" ")
    //     queryResult.orderBy('users.'+list[0], list[1])
    //   }

    //   const totalUsers = await queryResult.getCount();

    //   if ('limit' in query) {
    //     queryResult.limit(query.limit);
    //   }

    //   if ('page' in query) {
    //     queryResult.offset(query.page);
    //   }

    //   let users = await queryResult.getMany();
    //   // users = users.map((item)=>{
    //   //   let user = item
    //   //   item.entreprise
    //   //   return item
    //   // })
      const users  = await this.userRepository.query(`select * from users`);
      return { Result: "OK" , Records: users, TotalRecordCount:users.length };
  }

  async findOne(clause): Promise<any> {
    return await this.userRepository.findOne({
        where: clause
        //relations: [ "profile", "captainToCompany", "company" ]
      });
  }


  async get(id: number): Promise<UserResultDB> {
    const user = await this.userRepository.findOne(id);
    return user;
  }

  async update(id: number, userData: any): Promise<any> {
    let toUpdate = await this.userRepository.findOne({ id: id});
    let updated = Object.assign(toUpdate, userData);
    return await this.userRepository.save(updated);
  }

  async toggleAtivation(id: number): Promise<any> {
    let toUpdate = await this.userRepository.findOne({ id: id});
    toUpdate.isActive = !toUpdate.isActive
    if (toUpdate.isActive.toString().toLowerCase() == 'true') {
      toUpdate.deletedAt = new Date()
    }
    // TODO: send message
    return await this.userRepository.save(toUpdate);
  }

  async ban(id: number): Promise<any> {
    let toUpdate = await this.userRepository.findOne({ id: id});
    toUpdate.isBanned = true
    return await this.userRepository.save(toUpdate);
  }

  async changePassword(id: number, userData: any): Promise<any> {
    const passHash = crypto.createHmac('sha256', userData.oldPassword).digest('hex');
    const user = await this.userRepository
    .createQueryBuilder('users')
    .where('users.id = :id and users.password = :password')
    .setParameter('id', id)
    .setParameter('password', passHash)
    .getOne();
    let toUpdate = await this.userRepository.findOne({ id: id});
    if (user) {
      user.password = user.newPassword;
      return await this.userRepository.save(user);
    }else{
      throw new NotAcceptableException(
            'Mot de passe erronè.',
      );
    }


  }
  
  // PRIVATES

  private async _generatePassword() {
    //Generate 10 digits number
    return await (Math.floor(Math.random() * (9000000000)) + 1000000000).toString()
  }

  private async _sendEmail(mailOptions: any) {
      let transporter = nodemailer.createTransport({
        host: this.configService.get("EMAIL_HOST"),
        port: this.configService.get("EMAIL_PORT"),
        secure: this.configService.get("EMAIL_SECURE"), // true for 465, false for other ports
        auth: {
          user: this.configService.get("EMAIL_USER"),
          pass: this.configService.get("EMAIL_PASS")
        },
        /*tls:{
            ciphers:'SSLv3'
        }*/
    });

    return await new Promise<boolean>(async function(resolve, reject) {
      return await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log('Message sent: %s', error);
          return reject(false);
        }
        console.log('Message sent: %s', info.messageId);
        resolve(true);
      });
    })
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
  async add(user :CreateUserDTO){
    user.password = await this._generatePassword();
    let newUser = await this.userRepository
      .insert(user)
    return newUser.identifiers[0].id;
  }

  async delete(id){
    await this.userRepository
      .delete(id);
  }
}
