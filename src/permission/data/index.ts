import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionSubject } from '../permission.type';
import { UserPermissionData } from './user.data';

export const PermissionSubjectData: Array<{
  subject: string;
  permissions: CreatePermissionDto[];
}> = [
  {
    subject: PermissionSubject.USER,
    permissions: [...UserPermissionData],
  },
];
