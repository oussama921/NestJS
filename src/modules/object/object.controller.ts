import { ApiImplicitQueries } from 'nestjs-swagger-api-implicit-queries-decorator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiResponse, ApiTags, ApiOperation, ApiBearerAuth,ApiQuery,
ApiConsumes, 
ApiParam} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Body,
  Request,
  Query,
  Put,
  Post,
  Get,
  HttpStatus,
  HttpCode,
  UseGuards,  UploadedFile,
    UploadedFiles,
    UseInterceptors,
    Res,
    Param,
    Delete
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor
} from '@nestjs/platform-express';

import { ResponseError, ResponseSuccess } from '../common/dto/response.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { ObjectsService } from '.';

import { CreateObjectDTO } from './dto/create-object.dto';
import { AuthService } from 'modules/auth';

@Controller('api/object')
@ApiTags('Object')
export class ObjectsController {
  constructor(
    private readonly objectService: ObjectsService,
    private authService: AuthService
  ) {
  }

  // @ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Get('search')
  // @HttpCode(HttpStatus.OK)
  // @ApiQuery({ name: "limit", required: false })
  // @ApiQuery({ name: "page", required: false })
  // @ApiImplicitQueries([ {name: 'limit', type: String},
  //                       {name: 'page', type: String}])
  @ApiOperation({ summary: 'Get all objects' })
  // @ApiResponse({ status: 200, description: 'Successful Response' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Query() query,@Request() request): Promise<any> {
    try {
      let data= await this.authService.verifyToken(request)
      const objects = await this.objectService.findAll(query);
      return objects;
    } catch(error) {
      console.log(error)
      throw new HttpException('FIND_ALL_USERS.ERROR', HttpStatus.FORBIDDEN);
      // return new ResponseError("FIND_ALL_USERS.ERROR", error.message);
    }
  }


  @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  @Get('byId')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: "id", required: true })
  @ApiImplicitQueries([ {name: 'id', type: String}])
  @ApiOperation({ summary: 'Get object by Id' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(@Query('id') id,@Request() request): Promise<any> {
    try {
      let data= await this.authService.verifyToken(request)
      const object = await this.objectService.findOne({id});
      return new ResponseSuccess("GET_USER.SUCCESS", object);
    } catch(error) {
      return new ResponseError("GET_USER.ERROR", error.message);
    }
  }

  // @ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Put('')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // update object and object profile
  async updateObject(@Body() updateObjectDto: UpdateObjectDto,@Request() request): Promise<any> {
    try {
      let data= await this.authService.verifyToken(request)
      // updateObjectDto.avatar = file.path;
      const id = updateObjectDto.id;
      delete updateObjectDto.id
      const myProfile = await this.objectService.update(id, updateObjectDto);
      return new ResponseSuccess("UPDATE_USER.SUCCESS", myProfile);
    } catch(error) {
      console.log(error)
      throw new HttpException('UPDATE_USER.ERROR', HttpStatus.FORBIDDEN);
      // return new ResponseError("UPDATE_USER.ERROR", error);
    }
  }
 
  // @ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Post('add')
  async add(@Body() addObjectDTO : CreateObjectDTO,@Request() request) : Promise<any>{
    try {
      let data= await this.authService.verifyToken(request)
      await this.objectService.add(addObjectDTO);
      return new ResponseSuccess("ADDED_USER.SUCCESS");
    } catch(error) {
      return new ResponseError("ADDED_USER.ERROR", error);
    }
  }


  @Delete('delete')
  @ApiQuery({ name: "id", required: true })
  async delete(@Query('id') id ,@Request() request) : Promise<any>{
    try{
      let data= await this.authService.verifyToken(request)
      this.objectService.delete(id);
      return new ResponseSuccess("DELETED_USER.SUCCESS");
    }catch(error){
      console.log(error);
      return new ResponseError("DELETED_USER.ERROR", error);
    }
  }
}
