import { ActiveStatus } from 'src/common/types/status';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import {
  PermissionAction,
  PermissionCodeDefault,
  PermissionSubject,
} from '../permission.type';

const SUBJECT = PermissionSubject.USER;

export const UserPermissionData: CreatePermissionDto[] = [
  {
    name: 'Manager user',
    action: PermissionAction.MANAGER,
    subject: SUBJECT,
    code: PermissionCodeDefault.MANAGER,
    status: ActiveStatus.ACTIVE,
  },
  {
    name: 'Create new user',
    action: PermissionAction.CREATE,
    subject: SUBJECT,
    code: PermissionCodeDefault.CREATE,
    status: ActiveStatus.ACTIVE,
  },
  {
    name: 'Update user',
    action: PermissionAction.UPDATE,
    subject: SUBJECT,
    code: PermissionCodeDefault.UPDATE,
    status: ActiveStatus.ACTIVE,
    conditions: { createdBy: true },
  },
  {
    name: 'List user',
    action: PermissionAction.READ,
    subject: SUBJECT,
    code: PermissionCodeDefault.LIST,
    status: ActiveStatus.ACTIVE,
  },
  {
    name: 'Retrieve user',
    action: PermissionAction.READ,
    subject: SUBJECT,
    code: PermissionCodeDefault.RETRIEVE,
    status: ActiveStatus.ACTIVE,
    conditions: { createdBy: true },
  },
  {
    name: 'Remove user',
    action: PermissionAction.UPDATE,
    subject: SUBJECT,
    code: PermissionCodeDefault.REMOVE,
    status: ActiveStatus.ACTIVE,
    conditions: { createdBy: true },
  },
  {
    name: 'Delete user',
    action: PermissionAction.DELETE,
    subject: SUBJECT,
    code: PermissionCodeDefault.DELETE,
    status: ActiveStatus.OFF,
    conditions: { createdBy: true },
  },
];
