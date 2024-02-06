export enum UserInternalRole {
  Admin = 'admin',
  Moderator = 'moderator',
  Unknown = 'unknown',
}

const isStringUserInternalRole = (value: string | undefined): value is UserInternalRole => {
  return (Object.values(UserInternalRole) as string[]).includes(value ?? '');
};

export const getUserInternalRoleFromValue = (value: string | undefined): UserInternalRole|undefined => {
  return isStringUserInternalRole(value) ? value : undefined;
};

export interface IUserInternalProps {
  readonly firstName: string;
  readonly id: string;
  readonly lastName: string;
  readonly role: UserInternalRole;
}

export interface IUserInternal extends IUserInternalProps {
  isAdmin: boolean;
}
