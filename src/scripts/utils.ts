import { firebaseConfig } from './dbConfig';
import type { FirebaseError } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import { initializeApp } from '@firebase/app';
import { Route } from './Route';
import type{ RouteEntity } from './Route';
import { RouteName } from './Route';
import { signOut } from '@firebase/auth';
import { toast } from './toast';

const setAppSpinner = (isLoading: boolean): void => {
  const loader = document.querySelector('.app-spinner');
  if (!loader) {
    return;
  }
  if (isLoading) {
    loader.classList.remove('loaded');
    return;
  }
  loader.classList.add('loaded');
};

const navigate = (route: RouteEntity, replace = false): void => {
  if (replace) {
    window.history.replaceState({}, '', route.path);
    window.location.pathname = route.path;
  } else {
    window.location.pathname = route.path;
  }
}

const addSignOutHandler = (): void => {
  const signOutButton = document.getElementById('sign-out-button');
  if (!signOutButton) {
    return;
  }
  signOutButton.addEventListener('click', () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    signOut(auth).then(() => {
      navigate(Route[RouteName.Admin]);
    }).catch((error: FirebaseError) => {
      toast.error(`${error.code}: ${error.message}`);
      console.error(error);
      console.error('Error during sign out');
    });
  });
}



export const utils = {
  navigate,
  setAppSpinner,
  addSignOutHandler,
}