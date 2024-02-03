import { addContentRows } from './addContentRows';
import { AdminMenu } from '@/classes/AdminMenu';
import { apiUserFirebase } from '@/api';
import { apiUserInternal } from '@/api';
import { RouteName } from '@/types';
import { Routes } from '@/scripts/Routes';
import { toast } from '@/scripts/toast';
import { TranslateManager } from '@/classes/TranslateManager';
import { utils } from '@/scripts/utils';

const init = async (): Promise< void> => {
  const userFirebase = await apiUserFirebase.getUser();
  if (!userFirebase) {
    utils.navigate(Routes[RouteName.Admin]);
    return;
  }
  const userInternal = await apiUserInternal.getUser(userFirebase);
  if (!userInternal) {
    toast.warning('You are not authorized to access this page');
    const signOutResult = await apiUserFirebase.signOutFirebase();
    if (signOutResult) {
      utils.navigate(Routes[RouteName.Home]);
    } else {
      toast.error('Some error occurred. Please try again later.');
    }
    return;
  }
  if (!userInternal.isAdmin) {
    utils.navigate(Routes[RouteName.Reviews], true);
    return;
  }
  const translateManager = new TranslateManager({ translations: {}, route: Routes[RouteName.AdminContent] });
  await translateManager.init();
  const menu = new AdminMenu({ userInternal, userFirebase, route: Routes[RouteName.AdminContent] });
  menu.init();
  const translations = translateManager.translations;
  addContentRows(translations);
  translateManager.translatePage();
  utils.setAppSpinner(false);
};

init().catch((error) => {
  console.error(error);
  toast.error('Some error occurred. Please try again later.');
});
