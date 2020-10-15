import {DefiEntity} from '../defi/defi.entity';

export interface UserData {
  username: string;
  email: string;
  token: string;
  bio: string;
  image?: string;
}

export interface UserRO {
  user: UserData;
}

export interface UserWithActionsRO {
    id: number
    username: string;
    email: string
    bio: string
    image: string;
    points: number;
    hasActions: DefiEntity[];
}