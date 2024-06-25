import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateRolePermissionDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  permissionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roleId: string;
}
