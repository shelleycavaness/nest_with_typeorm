import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { type } from 'os';

@Entity('defi')
export class DefiEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: ''})
  category: string;

  @Column({default: ''})
  title: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  image: string;

  @Column({default: 0})
  gamePoints: number;

  @Column({default: 0})
  actionKw: number;

  @Column({default: 0})
  actionCo2: number;

  @Column({default: 0})
  actionH2O: number;

  // @ManyToMany(type => UserEntity)
  // @JoinTable()
  // userEntity: UserEntity[];

/***********or should this be in the user Enitity class? *******************/
// @ManyToMany(type => DefiEntity)
// defiEntity: DefiEntity[];
}