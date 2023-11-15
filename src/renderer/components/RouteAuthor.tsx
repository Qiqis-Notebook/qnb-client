import { RouteDetail, RouteObject } from "@Types/Routes";
import DBFavorite from "../db/type/DBFavorite";
import DBRecent from "../db/type/DBRecent";

// Asset
import Logo from "@Assets/qiqiLogo.png";
import { CalendarDaysIcon, UserIcon } from "@heroicons/react/24/outline";

export default function RouteAuthor({
  route,
}: {
  route: RouteObject | RouteDetail | DBRecent | DBFavorite;
}) {
  const date = new Date(route.updatedAt);
  return (
    <div className="flex flex-row items-center">
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
        <UserIcon className="h-full w-4" title="Author" />
      )}
      <div className="ml-1 truncate">
        {route?.author?.displayName || "Traveler"}
      </div>
      <CalendarDaysIcon className="ml-2 h-full w-4" title="Last updated" />
      <div
        className="ml-1"
        title={`${date.toLocaleString()}`}
      >{`${date.toLocaleDateString()}`}</div>
    </div>
  );
}
