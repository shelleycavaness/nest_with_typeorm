import { HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { DefiEntity } from './defi.entity';
import { UserEntity } from '../user/user.entity';
import { CreateDefiDto, UpdateDefiDto } from './create-defi-dto'
import { validate } from 'class-validator';
import {HttpException} from "@nestjs/common/exceptions/http.exception";


@Injectable()
export class DefiService {
  constructor(
  @InjectRepository(DefiEntity)
    private readonly defiRepository: Repository<DefiEntity>,
  @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

 //************* find all defi *****************//
  async findAll(): Promise<DefiEntity[]> {
    return await this.defiRepository.find();
  }

//*************  create a new defi           *****************// 
  async create( defiData: CreateDefiDto): Promise<DefiEntity> {
    console.log('defiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', )
    const { title, description, image,  } = defiData;
   // create new defi
    let defi = new DefiEntity();
    defi.title = title;
    defi.description = description;
    defi.image = image;
  
    const newDefi = await this.defiRepository.save(defi);
    const errors = await validate(newDefi);
    if (errors.length > 0) {
      const _errors = {title: 'Userinput is not valid.'};
      throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);

    } else {
      const savedDefi = await this.userRepository.save(newDefi);
      console.log('defi is being saved')
      return savedDefi
      // return this.buildUserRO(savedDefi);
    }
  }
//******************update  a defi ************//
  async update(id: number, defiData: any): Promise<{defi: DefiEntity}> {
    let toUpdate = await this.defiRepository.findOne({ id: id});
    let updated = Object.assign(toUpdate, defiData);
    if (!updated) {
      throw new Error( `The action with the id ${id} doesn't exist`);
    }
    const defi = await this.defiRepository.save(updated);
    console.log("defi updated--", defi)
    return { defi};
  }

  //**************get an item by id *******************//

  async findDefi(id: number): Promise<{defi: DefiEntity}> {
    // console.log('toto :>> has an email UserData', this, id);
    const defi = await this.defiRepository.findOne({id: id});
    return {defi}
  }



  

}


// private buildUserRO(defi: DefiEntity) {
//   const defiRO = {
//     // id: defi.id,
//     title: defi.title,
//     description: defi.description,
//     image: defi.image,
//     // category: defi.category
//   };

//   return {defi: defiRO};
// }