import { Link } from "react-router-dom";

// Types
import type { RouteDetail, RouteObject } from "@Types/Routes";
import type DBFavorite from "../db/type/DBFavorite";
import type DBRecent from "../db/type/DBRecent";

// Asset
import Logo from "@Assets/qiqiLogo.png";
import { UserIcon } from "lucide-react";

export default function RouteAuthor({
  route,
}: {
  route: RouteObject | RouteDetail | DBRecent | DBFavorite;
}) {
  const author = route.author;
  return author ? (
    <Link
      to={`/u/${author._id}`}
      target="_blank"
      className="btn no-animation btn-xs inline-flex w-fit gap-1 px-0"
    >
      {author?.image ? (
        <img
          src={author.image || "/qiqiLogo.png"}
          width={22}
          height={22}
          alt="User Icon"
          className="aspect-square h-[22px] w-[22px] rounded-full"
          onError={(e) => {
            {
              e.currentTarget.src = Logo;
            }
          }}
        />
      ) : (
        <UserIcon className="aspect-square h-full" />
      )}
      {author.displayName ? (
        <span className="text-sm">{author.displayName}</span>
      ) : (
        <span className="text-sm">{author?.displayName ?? "Traveler"}</span>
      )}
    </Link>
  ) : (
    <div className="btn btn-disabled no-animation btn-ghost btn-xs justify-start gap-1 px-0">
      <UserIcon className="h-6 w-6 rounded-full" />
      <span className="text-sm">{"Unknown Traveler"}</span>
    </div>
  );
}
