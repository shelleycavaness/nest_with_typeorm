import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany} from 'typeorm';
import { Expose } from 'class-transformer'; //
import { IsEmail } from 'class-validator';
import * as argon2 from 'argon2';
import { ArticleEntity } from '../article/article.entity';
import { DefiEntity } from "../defi/defi.entity";

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({default: ''})
  bio: string;

  @Column({default: ''})
  image: string;

  @Column()
  password: string;

  @Column({default: 0})
  points: number;
 
  @Expose()
  get totalPoints(): number {
    let totalPoints = 0;
    this.hasActions.forEach(action => {
      totalPoints += action.gamePoints;
    });
    return totalPoints;
  }
  
  @Expose()
  get totalKw(): number {
    let totalKw = 0;
    this.hasActions.forEach(action => {
      totalKw += action.actionKw;
    });
    return totalKw;
  }
  
  @Expose()
  get totalCo2(): number {
    let totalCo2 = 0;
    this.hasActions.forEach(action => {
      totalCo2 += action.actionCo2;
    });
    return totalCo2;
  }

  @Expose()
  get totalH2O(): number {
    let totalH2O = 0;
    this.hasActions.forEach(action => {
      totalH2O += action.actionH2O;
    })
    return totalH2O;
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @ManyToMany(type => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];

  @OneToMany(type => ArticleEntity, article => article.author)
  articles: ArticleEntity[];

  /***********joins user Enitity class to the DefiEntity? *******************/
  @ManyToMany(type => DefiEntity)
  @JoinTable()
  hasActions: DefiEntity[];
}
  /***********A user had finished N actions : list those completed actions*******************/
  /***********How many users have challenge #1? *******************/

