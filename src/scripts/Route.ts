export enum RouteName {
  About = 'About',
  Admin = 'Admin',
  AdminApplications = 'AdminApplications',
  AdminContent = 'AdminContent',
  AdminReviews = 'AdminReviews',
  AdminUsers = 'AdminUsers',
  Home = 'Home',
  Reviews = 'Reviews',
}

export interface RouteEntity {
  readonly path: string;
  readonly metaTitleKey: string;
}

type IRoute = {
  [key in RouteName]: RouteEntity;
}

export const Route: IRoute = Object.freeze({
  [RouteName.About]: {
    path: '/about',
    metaTitleKey: 'app_meta_title_about',
  },
  [RouteName.Admin]: {
    path: '/admin',
    metaTitleKey: 'app_meta_title_sign_in',
  },
  [RouteName.AdminApplications]: {
    path: '/admin/applications',
    metaTitleKey: 'app_meta_title_applications',
  },
  [RouteName.AdminContent]: {
    path: '/admin/content',
    metaTitleKey: 'app_meta_title_content',
  },
  [RouteName.AdminReviews]: {
    path: '/admin/reviews',
    metaTitleKey: 'app_meta_title_reviews',
  },
  [RouteName.AdminUsers]: {
    path: '/admin/users',
    metaTitleKey: 'app_meta_title_users',
  },
  [RouteName.Home]: {
    path: '/',
    metaTitleKey: 'app_meta_title_home',
  },
  [RouteName.Reviews]: {
    path: '/reviews',
    metaTitleKey: 'app_meta_title_reviews',
  },
});