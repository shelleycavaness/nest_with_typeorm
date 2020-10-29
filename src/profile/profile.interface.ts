import {DefiEntity} from '../defi/defi.entity';
export interface ProfileData {
  // id: number ;
  username: string;
  bio: string;
  points: number;
  image?: string;
  // following?: boolean;
}

export interface ProfileRO {
  profile: ProfileData;
}

export interface ProfileDataWithId {
  id: number ;
  username: string;
  bio: string;
  points: number;
  image?: string;
  hasActions: DefiEntity[];
}

export interface ProfileROById{
  profileWithId : ProfileDataWithId
}

