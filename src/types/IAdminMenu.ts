import type { IUserInternal } from './IUserInternal';
import type { Route } from './IRoute';
import type { User } from '@firebase/auth';

export interface IAdminMenuProps {
  readonly route: Route
  readonly userFirebase: User;
  readonly userInternal: IUserInternal;
}

export interface IAdminMenu extends IAdminMenuProps {
  init: () => void;
}
