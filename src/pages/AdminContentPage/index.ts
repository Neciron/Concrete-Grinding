import { $t } from '@/scripts/$t';
import { addContentRows } from './addContentRows';
import { AdminMenu } from '@/classes/AdminMenu';
import { apiUserFirebase } from '@/api';
import { apiUserInternal } from '@/api';
import { appSpinner } from '@/components/appSpinner';
import { navigate } from '@/router';
import { RouteName } from '@/types';
import { Routes } from '@/router';
import { show } from '@/utils';
import { TranslateManager } from '@/classes/TranslateManager';

const init = async (): Promise< void> => {
  const userFirebase = await apiUserFirebase.getUser();
  if (!userFirebase) {
    navigate(Routes[RouteName.Admin]);
    return;
  }
  const translateManager = new TranslateManager({ translations: {}, route: Routes[RouteName.AdminContent] });
  await translateManager.init();
  const userInternal = await apiUserInternal.getUser(userFirebase);
  if (!userInternal) {
    show.warning('Користувача не знайдено');
    const signOutResult = await apiUserFirebase.signOutFirebase();
    if (signOutResult) {
      navigate(Routes[RouteName.Home]);
    } else {
      show.error($t('app_application_error'));
    }
    return;
  }
  if (!userInternal.isAdmin) {
    navigate(Routes[RouteName.Feedbacks], true);
    return;
  }
  const menu = new AdminMenu({ userInternal, userFirebase, route: Routes[RouteName.AdminContent] });
  menu.init();
  const translations = translateManager.translations;
  addContentRows(translations);
  translateManager.translatePage();
  appSpinner.hide();
};

init().catch(() => {
  show.error($t('app_application_error'));
});
