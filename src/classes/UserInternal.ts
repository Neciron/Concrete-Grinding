import type { IUserInternal } from '@/types';
import type { IUserInternalProps } from '@/types';
import { UserInternalRole } from '@/types';

export class UserInternal implements IUserInternal {
  public readonly firstName;
  public readonly lastName;
  public readonly role;

  public constructor(props: IUserInternalProps) {
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.role = props.role;
  }

  public get isAdmin(): boolean {
    return this.role === UserInternalRole.Admin;
  }
}
