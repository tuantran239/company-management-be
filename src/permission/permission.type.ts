export enum PermissionAction {
  MANAGER = 'manager',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum PermissionSubject {
  ALL = 'all',
  ROLE = 'role',
  USER = 'user',
}

export enum PermissionCodeDefault {
  MANAGER = 'manager',
  CREATE = 'create',
  UPDATE = 'update',
  LIST = 'list',
  RETRIEVE = 'retrieve',
  DELETE = 'delete',
  REMOVE = 'remove',
}

export interface PermissionConditions {
  createdBy?: boolean;
  checkRoleManager?: boolean;
}
