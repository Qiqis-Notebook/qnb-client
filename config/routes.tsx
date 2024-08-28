// Types
import type { RouteObject } from "@Types/RouteTypes";

// Icon
import { HomeIcon, RouteIcon } from "lucide-react";

export const routes: RouteObject[] = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Routes",
    icon: RouteIcon,
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
