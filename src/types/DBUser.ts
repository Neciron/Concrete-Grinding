export enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
}

export interface DBUser {
  readonly first_name: string;
  readonly last_name: string;
  readonly role?: UserRole;
}