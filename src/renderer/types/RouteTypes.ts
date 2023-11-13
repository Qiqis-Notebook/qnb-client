export type RouteObject = {
  title: string; // Item title
  url?: string; // Item href, link item if provided
  icon?: any; // Icon
  child?: {
    title: string; // Item title
    url: string; // Item href, link item if provided
    icon?: any; // Icon
  }[];
};
export interface RouteProp {
  routes: RouteObject;
}
export const routes: RouteObject[] = [];
