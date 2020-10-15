import { Get, Post, Body, Put, Delete, Param, Query, Controller, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from './user.service';
import { DefiEntity } from '../defi/defi.entity'
import { UserRO, UserWithActionsRO } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';


//this is where a user manages her own profile
@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}
/**************    user has to be logged in endpoints  ***************/
/************ get a user with token and middleware**************/
  @Get('user')
  async findMe(@User('email') email: string): Promise<UserRO> {
    // console.log('toto :>> has an email UserData', this, email);
    return await this.userService.findByEmail(email);
  }
/************ modify a user accoring to the UpdateUserDto**************/
  @Put('user')
  async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
    // console.log('toto :>> has an email UserData', this);
    // console.log('userdata 77777777777777777777777777777', userData)
    // console.log('userID ///////////////////', userId);

    return await this.userService.update(userId, userData);
  }

  /**********   get all defis by a user with a jwt to identify the user************/
  /** creaded a userWithActions interface, and added hasAcions list,   **/


    @ApiOperation({ summary: 'Get all defi from a user' })
    @ApiResponse({ status: 200, description: 'Return users defi.'})
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get('player')
    async getUserDefi(@User('id') userId: number): Promise<UserWithActionsRO> {
      const user = await this.userService.findUserActions(userId)
      const userWithoutPwd = {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        bio: user[0].bio,
        image: user[0].image,
        points: user[0].points,
        hasActions: user[0].hasActions
      }
      return userWithoutPwd
    }

  /**************    user is not logged in in endpoints  ***************/
  /**********   Create a user ************/
  @UsePipes(new ValidationPipe())
  @Post('users') //you must post a user object with your info inside
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }
  
  /********** Login for a  user ************/
  @UsePipes(new ValidationPipe())
  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
    const _user = await this.userService.findMyUser(loginUserDto);

    const errors = {User: ' not found'};
    if (!_user) throw new HttpException({errors}, 401);

    const token = await this.userService.generateJWT(_user);
    const {email, username, bio, image} = _user;
    const user = {email, token, username, bio, image};
    return {user}
  }







}
