import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DefiEntity } from './defi.entity';

// export class User_Defi{
//   @PrimaryGeneratedColumn()
//   id: number;







// }