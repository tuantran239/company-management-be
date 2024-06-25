import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';

export class ListUserQuery extends BaseQueryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  search?: string;
}
