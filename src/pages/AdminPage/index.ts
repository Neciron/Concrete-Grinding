import { $t } from '@/scripts/$t';
import { addSignInFormHandler } from './addSignInFormHandler';
import { apiUserFirebase } from '@/api';
import { apiUserInternal } from '@/api';
import { appSpinner } from '@/components/appSpinner';
import { navigate } from '@/router';
import { RouteName } from '@/types';
import { Routes } from '@/router';
import { show } from '@/utils';
import { TranslateManager } from '@/classes/TranslateManager';

const init = async (): Promise<void> => {
  const userFirebase = await apiUserFirebase.getUser();
  if (userFirebase) {
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
    navigate(Routes[RouteName.AdminFeedbacks], true);
    return;
  }
  const translateManager = new TranslateManager({ translations: {}, route: Routes[RouteName.Admin] });
  await translateManager.init();
  addSignInFormHandler();
  appSpinner.hide();
};

init().catch((error) => {
  console.error(error);
  show.error($t('app_application_error'));
});

