import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { type } from 'os';

@Entity('defi')
export class DefiEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column({default: ''})
  description: string;

  @Column()
  image: string;

  @Column()
  gamePoints: number;

  @Column()
  actionKw: number;

  @Column()
  actionCo2: number;

  @Column()
  actionH2O: number;

  // @ManyToMany(type => UserEntity)
  // @JoinTable()
  // userEntity: UserEntity[];

/***********or should this be in the user Enitity class? *******************/
// @ManyToMany(type => DefiEntity)
// defiEntity: DefiEntity[];
}