import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
import { getMessageValidator } from 'src/common/error/get-message-validator';

export class CreateUserDto extends BaseDto {
  @ApiProperty()
  @IsEmail(
    {},
    {
      message: getMessageValidator('errors.dto.email.not_valid'),
    },
  )
  @IsNotEmpty({ message: getMessageValidator('errors.dto.email.not_empty') })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  managerId?: string;
}
