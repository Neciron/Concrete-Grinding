export enum RouteName {
  About = 'About',
  Admin = 'Admin',
  AdminApplications = 'AdminApplications',
  AdminContent = 'AdminContent',
  AdminFeedbacks = 'AdminFeedbacks',
  AdminUsers = 'AdminUsers',
  Home = 'Home',
  Feedbacks = 'Feedbacks',
}

export interface Route {
  readonly metaTitleKey: string;
  readonly name: RouteName;
  readonly path: string;
}

export type IRoutes = {
  [key in RouteName]: Route;
}
