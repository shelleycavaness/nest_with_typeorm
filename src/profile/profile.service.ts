import { HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ProfileRO, ProfileData, ProfileROById, ProfileDataWithId } from './profile.interface';
import { UserRO, UserWithActionsRO, UserWARO} from '../user/user.interface'
import {FollowsEntity} from "./follows.entity";
import {DefiEntity} from '../defi/defi.entity';
import {HttpException} from "@nestjs/common/exceptions/http.exception";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
    @InjectRepository(DefiEntity)
    private readonly defiRepository: Repository<DefiEntity>,  
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(options?: DeepPartial<UserEntity>): Promise<ProfileRO> {
    const user = await this.userRepository.findOne(options);
    delete user.id;
    if (user) delete user.password;
    return {profile: user};
  }

  async findProfile(id: number, followingUsername: string): Promise<ProfileRO> {
    const _profile = await this.userRepository.findOne( {username: followingUsername});

    if(!_profile) return;

    let profile: ProfileData = {
      username: _profile.username,
      bio: _profile.bio,
      image: _profile.image,
      points: _profile.points
    };
    // const follows = await this.followsRepository.findOne( {followerId: id, followingId: _profile.id});
    // if (id) {
    //   profile.following = !!follows;
    // }
    return {profile};
  }

//////////find a player by id//////////////////
  async findUserById(id: number): Promise<ProfileDataWithId>{
    const profile = await this.userRepository.findOne(
      {id}
      );
    if (!profile) {
      const errors = {User: ' not found'};
      throw new HttpException({errors}, 401);
    }
    return profile 
    // return this.buildUserRO(user);
  }
//////////find a player by id//////////////////
  //   async findPlayerProfileById(id: number ): Promise<ProfileROById> {
  //     const _profile2 = await this.userRepository.findOne(id);
  //     if(!_profile2) return;
  //     let profile2: ProfileDataWithId = {
  //       username: _profile2.username,
  //       bio: _profile2.bio,
  //       image: _profile2.image,
  //       points: _profile2.points,
  //       id : _profile2.id
  //     };
  //   return {profile2};
  // }

  // async follow(followerEmail: string, username: string): Promise<ProfileRO> {
  //   if (!followerEmail || !username) {
  //     throw new HttpException('Follower email and username not provided.', HttpStatus.BAD_REQUEST);
  //   }

  //   const followingUser = await this.userRepository.findOne({username});
  //   const followerUser = await this.userRepository.findOne({email: followerEmail});

  //   if (followingUser.email === followerEmail) {
  //     throw new HttpException('FollowerEmail and FollowingId cannot be equal.', HttpStatus.BAD_REQUEST);
  //   }

  //   const _follows = await this.followsRepository.findOne( {followerId: followerUser.id, followingId: followingUser.id});

  //   if (!_follows) {
  //     const follows = new FollowsEntity();
  //     follows.followerId = followerUser.id;
  //     follows.followingId = followingUser.id;
  //     await this.followsRepository.save(follows);
  //   }

  //   let profile: ProfileData = {
  //     username: followingUser.username,
  //     bio: followingUser.bio,
  //     image: followingUser.image,
  //     following: true,
  //     points: followingUser.points

  //   };

  //   return {profile};
  // }

  // async unFollow(followerId: number, username: string): Promise<ProfileRO> {
  //   if (!followerId || !username) {
  //     throw new HttpException('FollowerId and username not provided.', HttpStatus.BAD_REQUEST);
  //   }

  //   const followingUser = await this.userRepository.findOne({username});

  //   if (followingUser.id === followerId) {
  //     throw new HttpException('FollowerId and FollowingId cannot be equal.', HttpStatus.BAD_REQUEST);
  //   }
  //   const followingId = followingUser.id;
  //   await this.followsRepository.delete({followerId, followingId});

  //   let profile: ProfileData = {
  //     username: followingUser.username,
  //     bio: followingUser.bio,
  //     image: followingUser.image,
  //     following: false,
  //     points: followingUser.points

  //   };

  //   return {profile};
  // }


  private buildUserRO(user: UserWithActionsRO) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      // token: this.generateJWT(user),
      image: user.image,
      points: user.points,
      
    };
    return {user: userRO};
  }

}
