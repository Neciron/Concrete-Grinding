// import { onValue } from "firebase/database";
import { child } from 'firebase/database';
import { DBTable } from './database/DBTable';
// import { set } from "firebase/database";
import { get } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { ref } from 'firebase/database';
import type { RouteEntity } from './Route';

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



export const utils = {
  navigate,
  setAppSpinner,
}