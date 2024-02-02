import '@/scripts/critical';

import type { Auth } from 'firebase/auth';
import { checkUserRole } from '@/scripts/database';
import { firebaseConfig } from '@/scripts/dbConfig';
import type { FirebaseError } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import { initializeApp } from '@firebase/app';
import { onAuthStateChanged } from '@firebase/auth';
import { Route } from '@/scripts/Route';
import { RouteName } from '@/scripts/Route';
import { setTranslations } from '@/scripts/setTranslations';
import { signOut } from '@firebase/auth';
import { toast } from '@/scripts/toast';
import { UserRole } from '@/types';
import { utils } from '@/scripts/utils';

const addAuthStateChangedHandler = (auth: Auth): void => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      return;
    }
    checkUserRole(user, [UserRole.Admin]).then((userHasValidRole) => {
      if (!userHasValidRole) {
        signOut(auth).catch((error: FirebaseError) => {
          toast.error(`${error.code}: ${error.message}`);
          console.error(error);
          console.error('Error during sign out');
        });
        utils.navigate(Route[RouteName.Home], true);
      }
    }).catch((error) => {
      console.error(error);
    });
  });
}

const init = async (): Promise<void> => {
  utils.addSignOutHandler();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  addAuthStateChangedHandler(auth);
  const user = auth.currentUser;
  if (user) {
    const userHasValidRole = await checkUserRole(user, [UserRole.Admin]);
    toast.warning('You are not authorized to access this page');
    if (!userHasValidRole) {
      signOut(auth).catch((error: FirebaseError) => {
        toast.error(`${error.code}: ${error.message}`);
        console.error(error);
        console.error('Error during sign out');
      });
      utils.navigate(Route[RouteName.Home], true);
    }
  }
  await setTranslations(Route[RouteName.AdminContent]);
  utils.setAppSpinner(false);
}

init().catch((error) => {
  toast.error('An error during init occurred');
  console.error(error);
});
