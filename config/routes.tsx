// Icon
import { RouteObject } from "@Types/RouteTypes";
import { HomeIcon, MapIcon } from "@heroicons/react/24/outline";

export const routes: RouteObject[] = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Routes",
    icon: MapIcon,
    child: [
      {
        title: "Favorites",
        url: "/routes/favorites",
      },
      {
        title: "Recent",
        url: "/routes/recent",
      },
      {
        title: "Search",
        url: "/routes/search",
      },
    ],
  },
];
export default { routes };
