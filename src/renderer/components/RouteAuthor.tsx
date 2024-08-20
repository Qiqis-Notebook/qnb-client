import type { RouteDetail, RouteObject } from "@Types/Routes";
import type DBFavorite from "../db/type/DBFavorite";
import type DBRecent from "../db/type/DBRecent";

// Asset
import Logo from "@Assets/qiqiLogo.png";
import { CalendarDaysIcon, GamepadIcon, UserIcon } from "lucide-react";

export default function RouteAuthor({
  route,
}: {
  route: RouteObject | RouteDetail | DBRecent | DBFavorite;
}) {
  const date = new Date(route.updatedAt);
  return (
    <div className="flex flex-row items-center gap-1 overflow-hidden @container">
      <div className="inline-flex gap-1">
        {route.author && route.author.image ? (
          <img
            src={route.author.image}
            width={24}
            height={24}
            alt="User Icon"
            className="rounded-full"
            onError={(e) => {
              {
                e.currentTarget.src = Logo;
              }
            }}
          />
        ) : (
          <UserIcon className="h-6 w-6" />
        )}
        <span className="truncate">
          {route?.author?.displayName || "Traveler"}
        </span>
      </div>
      <div className="@sm:inline-flex gap-1 hidden">
        <CalendarDaysIcon className="ml-2 h-6 w-6" />
        <span
          title={`${date.toLocaleString()}`}
        >{`${date.toLocaleDateString()}`}</span>
      </div>
      <div className="inline-flex gap-1">
        <GamepadIcon className="h-6 w-6" />
        <span title={route.game === "Genshin" ? "Genshin" : "Wuthering Waves"}>
          {route.game}
        </span>
      </div>
    </div>
  );
}
