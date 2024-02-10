import type { IRoutes } from '@/types';
import type{ Route } from '@/types';
import { RouteName } from '@/types';

export const Routes: IRoutes = Object.freeze({
  [RouteName.About]: {
    metaTitleKey: 'app_meta_title_about',
    name: RouteName.About,
    path: '/about',
  },
  [RouteName.Admin]: {
    metaTitleKey: 'app_meta_title_sign_in',
    name: RouteName.Admin,
    path: '/admin',
  },
  [RouteName.AdminApplications]: {
    metaTitleKey: 'app_meta_title_applications',
    name: RouteName.AdminApplications,
    path: '/admin/applications',
  },
  [RouteName.AdminContent]: {
    metaTitleKey: 'app_meta_title_content',
    name: RouteName.AdminContent,
    path: '/admin/content',
  },
  [RouteName.AdminFeedbacks]: {
    metaTitleKey: 'app_meta_title_feedbacks',
    name: RouteName.AdminFeedbacks,
    path: '/admin/feedbacks',
  },
  [RouteName.AdminUsers]: {
    metaTitleKey: 'app_meta_title_users',
    name: RouteName.AdminUsers,
    path: '/admin/users',
  },
  [RouteName.Home]: {
    metaTitleKey: 'app_meta_title_home',
    name: RouteName.Home,
    path: '/',
  },
  [RouteName.Feedbacks]: {
    metaTitleKey: 'app_meta_title_feedbacks',
    name: RouteName.Feedbacks,
    path: '/feedbacks',
  },
});

export const navigate = (route: Route, replace = false): void => {
  if (replace) {
    window.history.replaceState({}, '', route.path);
    window.location.pathname = route.path;
  } else {
    window.location.pathname = route.path;
  }
};
