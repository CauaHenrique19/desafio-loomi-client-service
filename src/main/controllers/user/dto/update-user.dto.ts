import {
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsNumberString()
  @MinLength(6)
  @MaxLength(6)
  @IsOptional()
  bankAccount: string;

  @IsNumberString()
  @MaxLength(1)
  @IsOptional()
  digit: string;
}
