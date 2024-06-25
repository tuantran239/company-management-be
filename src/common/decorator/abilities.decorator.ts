import { SetMetadata } from '@nestjs/common';
import { PermissionConditions } from 'src/permission/permission.type';

export const CHECK_ABILITY = 'check_ability';

export interface RequiredRule {
  action: string;
  subject?: string;
  conditions?: PermissionConditions;
  code: string;
}

export const CheckAbilities = (requireRule: RequiredRule) =>
  SetMetadata(CHECK_ABILITY, requireRule);
