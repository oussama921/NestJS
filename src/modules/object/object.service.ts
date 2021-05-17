import { Connection } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Injectable, NotAcceptableException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

import { ConfigService } from '../config';
import { ObjectResultDB } from './model/object.result.db';
import { CreateObjectDTO } from './dto/create-object.dto';
import Objet from './object.entity';

@Injectable()
export class ObjectsService {

  private objectRepository;

  constructor(
    private readonly connection: Connection,
    private readonly configService: ConfigService, 
  ) {
    this.objectRepository = this.connection.getRepository(Objet);
  }

  async findAll(query): Promise<any> {
    
      const objects  = await this.objectRepository.query(`select * from objects`);
      return { Result: "OK" , Records: objects, TotalRecordCount:objects.length };
  }

  async findOne(clause): Promise<any> {
    return await this.objectRepository.findOne({
        where: clause
        //relations: [ "profile", "captainToCompany", "company" ]
      });
  }


  async get(id: number): Promise<ObjectResultDB> {
    const object = await this.objectRepository.findOne(id);

    return object;
  }

  async update(id: number, objectData: any): Promise<any> {
    let toUpdate = await this.objectRepository.findOne({ id: id});
    let updated = Object.assign(toUpdate, objectData);
    return await this.objectRepository.save(updated);
  }

  async add(object :CreateObjectDTO){
    let res=await this.objectRepository
      .insert(object)
  }

  async delete(id){
    await this.objectRepository
      .delete(id);
  }

 
}
