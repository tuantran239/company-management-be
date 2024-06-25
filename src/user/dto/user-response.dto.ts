import { Role } from 'src/role/role.entity';
import { User } from '../user.entity';
import { Permission } from 'src/permission/permission.entity';

export class UserResponseDto extends User {
  password: undefined;
  role: Role;
  permissions: Permission[];
}
