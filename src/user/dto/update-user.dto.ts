import { DefiEntity } from '../../defi/defi.entity'
export class UpdateUserDto {
  readonly username: string;
  readonly email: string;
  readonly bio: string;
  readonly image: string;
  // we need to udate the users points
  readonly points: number;  
}

export class UpdateUserActionsDto{
  // username: string;
  // email: string;
  hasActions: DefiEntity;
}