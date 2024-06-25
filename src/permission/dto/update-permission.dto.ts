import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PermissionConditions } from '../permission.type';

export class UpdatePermissionDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  action?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty()
  @IsString()
  conditions?: PermissionConditions;
}
