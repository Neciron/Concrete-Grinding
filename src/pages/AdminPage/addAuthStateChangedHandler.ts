import type { Auth } from 'firebase/auth';
import { checkUserRole } from '@/scripts/database';
import type { FirebaseError } from 'firebase/app';
import { onAuthStateChanged } from 'firebase/auth';
import { Route } from '@/scripts/Route';
import { RouteName } from '@/scripts/Route';
import { signOut } from 'firebase/auth';
import { toast } from '@/scripts/toast';
import { UserRole } from '@/types';
import { utils } from '@/scripts/utils'

export const addAuthStateChangedHandler = (auth: Auth): void => {
  onAuthStateChanged(auth, (user) => {
    console.log('onAuthStateChanged user');
    console.log(user);

    if (!user) {
      return;
    }
    checkUserRole(user, [UserRole.Admin, UserRole.Moderator]).then((userHasValidRole) => {
      console.log('userHasValidRole');
      console.log(userHasValidRole);
      if (!userHasValidRole) {
        signOut(auth).catch((error: FirebaseError) => {
          toast.error(`${error.code}: ${error.message}`);
          console.error(error);
          console.error('Error during sign out');
        });
        return;
      }
      utils.navigate(Route[RouteName.AdminReviews], true);
    }).catch((error) => {
      console.error(error);
    });
  });
}