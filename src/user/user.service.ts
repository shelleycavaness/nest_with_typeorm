import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import {CreateUserDto, LoginUserDto, UpdateUserDto} from './dto';
import { UpdateUserActionsDto } from './dto/update-user.dto'
const jwt = require('jsonwebtoken');
import { SECRET } from '../config';
import { UserRO, UserWithActionsRO } from './user.interface';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';
import { DefiEntity } from '../defi/defi.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DefiEntity)
    private readonly defiRepository: Repository<DefiEntity>,  
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
  /********** find user by email and password ************/
  async findMyUser({email, password}: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({email}); 
    if (!user) {
      return null;
    }
    if (await argon2.verify(user.password, password)) {
      return user;
    }

    return null;
  }
  /********** create a unique user ************/
  async create(dto: CreateUserDto): Promise<UserRO> {
    // check uniqueness of username/email
    const {username, email, password} = dto;
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      const errors = {username: 'Username and email must be unique.'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);

    }

    // create new user
    let newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    newUser.articles = [];

    const errors = await validate(newUser);
    console.log('errors in user.service for validating new users >>>>>> ', errors);
    if (errors.length > 0) {
      const _errors = {username: 'Userinput is not valid.'};
      throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);

    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildUserRO(savedUser);
    }

  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOne(id);
    delete toUpdate.password;
    delete toUpdate.favorites;

    let updated = Object.assign(toUpdate, dto);
    // console.log('updated 111111111111111111111111111111111111111', updated)
    return await this.userRepository.save(updated);
  }
 /************ add points to a user accoring to the UpdateUserDto**************/

 async updateScore(userId: number, defiId: number): Promise<UserWithActionsRO> {
  //find will return a list and findOne an object
  const toUpdateUserScore = await this.userRepository.findOne({
    relations: ["hasActions"], //from user.entity  -hasActions
      where: { id :userId }
  })
  delete toUpdateUserScore.password;

  const action = await this.defiRepository.findOne(defiId)
  if (!action) {
    throw Error("defi is null")
  }
  toUpdateUserScore.hasActions.push(action);
  toUpdateUserScore.points += action.gamePoints; //adds the points to the user
  return await this.userRepository.save(toUpdateUserScore);
 }
/***************     delete a user   ********************/
  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email: email});
  }
 
  async findById(id: number): Promise<UserRO>{
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = {User: ' not found'};
      throw new HttpException({errors}, 401);
    }
    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<UserRO>{
    const user = await this.userRepository.findOne({email: email});
    return this.buildUserRO(user);
  }

  async userWithActions(id: number): Promise<UserWithActionsRO> {
    console.log('service id===========', id)
    const userRepository = getRepository(UserEntity)
    const findUserActions = await userRepository.findOne({ 
      relations: ["hasActions"], //from user.entity  -hasActions
      where: { id: id }
    }); 
    console.log('USER_--------------', findUserActions)
    console.log('TOTAL POINTS---------', findUserActions.totalPoints)
    return findUserActions
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };

  private buildUserRO(user: UserEntity) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      token: this.generateJWT(user),
      image: user.image,
      points: user.points
    };
    return {user: userRO};
  }
}
