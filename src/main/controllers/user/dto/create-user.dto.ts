import {
  IsEmail,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsNumberString()
  @MinLength(6)
  @MaxLength(6)
  bankAccount: string;

  @IsNumberString()
  @MaxLength(1)
  digit: string;
}
