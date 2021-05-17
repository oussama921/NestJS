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

import { ApiFile } from '../common/decorators/api-file-decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseError, ResponseSuccess } from '../common/dto/response.dto';
import { UpdateUsereDto } from './dto/update-user.dto';
import { DownloadAvatarDto } from './dto/download-avatar.dto';
import { UsersService } from './';

import JwtAuthGuard from '../auth/jwt-guard';
import { AddUserDTO } from './dto/add-user.dto';
import User from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'modules/auth';

@Controller('api/user')
@ApiTags('User')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private authService : AuthService
  ) {}

  @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  @Get('search')
  // @HttpCode(HttpStatus.OK)
  // @ApiQuery({ name: "limit", required: false })
  // @ApiQuery({ name: "page", required: false })
  // @ApiImplicitQueries([ {name: 'limit', type: String},
  //                       {name: 'page', type: String}])
  @ApiOperation({ summary: 'Get all users' })
  // @ApiResponse({ status: 200, description: 'Successful Response' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Query() query,@Request() request): Promise<any> {
    try {
      const users = await this.userService.findAll(query);
      return users;
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
  @ApiOperation({ summary: 'Get user by Id' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(@Query('id') id,@Request() request): Promise<any> {
    try {
      const user = await this.userService.findOne({id});
      return new ResponseSuccess("GET_USER.SUCCESS", user);
    } catch(error) {
      return new ResponseError("GET_USER.ERROR", error.message);
    }
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyProfile(@Request() request): Promise<any> {
    
    try{
      let data= await this.authService.verifyToken(request)
      let id=data.id
      let user = await this.userService.findOne({id})
      delete user.password;
      return new ResponseSuccess("ME.SUCCESS", user);
    }catch(error){
      return new ResponseError("ME.ERROR", error.message);
    }
  }

  /*@ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Put('me')
  // @ApiConsumes('multipart/form-data')
  // @ApiFile('avatar')
  // @UseInterceptors(FileInterceptor('avatar'))
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // update user and user profile
  async updateMyProfile(@Request() request, @Body() updateMyProfileDto: UpdateMyProfileDto): Promise<any> {
    try {
      // updateMyProfileDto.avatar = file.path;
      const myProfile = await this.userService.update(request.user.id, updateMyProfileDto);
      return new ResponseSuccess("UPDATE_USER.SUCCESS", myProfile);
    } catch(error) {
      return new ResponseError("UPDATE_USER.ERROR", error);
    }
  }*/

  // @ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Put('')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // update user and user profile
  async updateUser(@Body() updateUserDto: UpdateUsereDto,@Request() request): Promise<any> {
    try {
      let data= await this.authService.verifyToken(request)
      
      // updateUserDto.avatar = file.path;
      const id = updateUserDto.id;
      delete updateUserDto.id
      const myProfile = await this.userService.update(id, updateUserDto);
      return new ResponseSuccess("UPDATE_USER.SUCCESS", myProfile);
    } catch(error) {
      throw new HttpException('UPDATE_USER.ERROR', HttpStatus.FORBIDDEN);
      // return new ResponseError("UPDATE_USER.ERROR", error);
    }
  }

  @ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Put('me/changePassword')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // update user and user profile
  async changePassword(@Request() request, @Body() changePasswordDto: ChangePasswordDto): Promise<any> {
    try {
      let data= await this.authService.verifyToken(request)

      const myProfile = await this.userService.changePassword(request.user.id, changePasswordDto);
      return new ResponseSuccess("UPDATE_USER.SUCCESS", myProfile);
    } catch(error) {
      return new ResponseError("UPDATE_USER.ERROR", error);
    }
  }

  // @ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Post('uploadUserAvatar')
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: "id", required: true })
  @ApiImplicitQueries([ {name: 'id', type: String}])
  @ApiFile('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadUserAvatar(@Query('id') id, @UploadedFile() file,@Request() request) {
    try {
      // let data= await this.authService.verifyToken(request)

      return new ResponseSuccess("UPLOAD_USER_AVATAR.SUCCESS", await this.userService.update(id, {avatar: file.path}));
    } catch(error) {
      console.log(error)
      return new ResponseError("UPLOAD_USER_AVATAR.ERROR", error);
    }
  }

  @ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Post('downloadAvatar')
  @ApiOperation({ summary: 'Download Avatar' })
  @ApiResponse({ status: 201, description: 'Succcess'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async downloadFile(@Body() data: DownloadAvatarDto, @Res() res,@Request() request) {
    try {

      return res.download('./'+data.avatar);
    
    } catch(error) {
      return new ResponseError("DOWNLOAD_USER_AVATAR.ERROR", error);
    }
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  // @Post('uploadUserMainPhoto')
  // @ApiQuery({ name: "id", required: true })
  // @ApiImplicitQueries([ {name: 'id', type: String}])
  // @ApiConsumes('multipart/form-data')
  // @ApiFile('mainPhoto')
  // @UseInterceptors(FileInterceptor('mainPhoto'))
  // uploadUserMainPhoto(@UploadedFile() file) {
  //   try {
  //     const user = await this.userService.updateUserProfile(id, {avatar: file.path});
  //     return new ResponseSuccess("UPLOAD_USER_PHOTO.SUCCESS", {url: file.path});
  //   } catch(error) {
  //     return new ResponseError("UPLOAD_USER_PHOTO.ERROR", error);
  //   }
  // }


  @ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Put('ban')
  @ApiQuery({ name: "id", required: true })
  @ApiImplicitQueries([ {name: 'id', type: String}])
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // ban user
  async banUser(@Query('id') id,@Request() request): Promise<any> {
    try {
      let data= await this.authService.verifyToken(request)
      const user = await this.userService.ban(id);
      return new ResponseSuccess("UPDATE_USER.SUCCESS", user);
    } catch(error) {
      return new ResponseError("UPDATE_USER.ERROR", error);
    }
  }

  @ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Put('toggleAtivation')
  @ApiQuery({ name: "id", required: true })
  @ApiImplicitQueries([ {name: 'id', type: String}])
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // ban user
  async toggleAtivation(@Query('id') id,@Request() request): Promise<any> {
    try {
      let data= await this.authService.verifyToken(request)
      const user = await this.userService.toggleAtivation(id);
      return new ResponseSuccess("UPDATE_USER.SUCCESS", user);
    } catch(error) {
      return new ResponseError("UPDATE_USER.ERROR", error);
    }
  }

  // @ApiBearerAuth()
  //@UseGuards(AuthGuard())
  @Post('add')
  async add(@Body() addUserDTO : CreateUserDTO,@Request() request) : Promise<any>{
    try {
      let data= await this.authService.verifyToken(request)
      let userId = this.userService.add(addUserDTO);
      if(await this.authService.createVerificationToken(addUserDTO["email"])){
        var sent = await this.authService.sendEmailVerification(addUserDTO["email"]);
          if(sent){
            return new ResponseSuccess("REGISTRATION.USER_REGISTERED_SUCCESSFULLY" );
          } else {
            return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
          }
      } else {
        return new ResponseError("REGISTRATION.ERROR.TOKEN_NOT_CREATED");
      }
      return new ResponseSuccess("ADDED_USER.SUCCESS");
    } catch(error) {
      return new ResponseError("ADDED_USER.ERROR", error);
    }
  }


  @Delete('delete')
  @ApiQuery({ name: "id", required: true })
  async delete(@Query('id') id,@Request() request ) : Promise<any>{
    try{
      let data= await this.authService.verifyToken(request)
      this.userService.delete(id);
      return new ResponseSuccess("DELETED_USER.SUCCESS");
    }catch(error){
      console.log(error);
      return new ResponseError("DELETED_USER.ERROR", error);
    }
  }
}
