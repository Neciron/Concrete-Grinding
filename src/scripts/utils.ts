// import { onValue } from "firebase/database";
import { child } from 'firebase/database';
import { DBTable } from './DBTable';
// import { set } from "firebase/database";
import { get } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { ref } from 'firebase/database';
import type { RouteName } from './Route';

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

const navigate = (pathName: RouteName, replace = false): void => {
  if (replace) {
    window.history.replaceState({}, '', pathName);
    window.location.pathname = pathName;
  } else {
    window.location.pathname = pathName;
  }
}



export const utils = {
  navigate,
  setAppSpinner,
}