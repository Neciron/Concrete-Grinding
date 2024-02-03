import type { FirebaseError } from '@firebase/app';
import type{ Route } from '@/types';
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

const navigate = (route: Route, replace = false): void => {
  if (replace) {
    window.history.replaceState({}, '', route.path);
    window.location.pathname = route.path;
  } else {
    window.location.pathname = route.path;
  }
};

const onFireBaseError = (error: FirebaseError): void => {
  toast.error(`${error.code}: ${error.message}`);
  console.error(error);
};


export const utils = {
  navigate,
  setAppSpinner,
  onFireBaseError,
};
