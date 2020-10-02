import { IsNotEmpty } from 'class-validator';
export class CreateDefiDto {


  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly image: string;



}

export class UpdateDefiDto {
  readonly id: number;

  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly image: string;

  @IsNotEmpty()
  readonly category: string;
}