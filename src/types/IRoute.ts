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

export interface Route {
  readonly metaTitleKey: string;
  readonly name: RouteName;
  readonly path: string;
}

export type IRoutes = {
  [key in RouteName]: Route;
}
