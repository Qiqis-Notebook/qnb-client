import { ReactNode } from "react";

// Context
import { useSettings } from "@Context/SettingsContext";

// Types
import type { RouteDetail } from "@Types/Routes";
import type DBFavorite from "../../db/type/DBFavorite";
import type DBRecent from "../../db/type/DBRecent";

// Icons
import {
  CalendarDaysIcon,
  BadgeCheckIcon,
  PlayIcon,
  GamepadIcon,
  EyeIcon,
  HeartIcon,
} from "lucide-react";

// Utils
import Linkify from "linkify-react";
import { Link } from "react-router-dom";

// Components
import RouteAuthor from "@Components/RouteAuthor";
import Divider from "@Components/Divider";
import AvatarList from "@Components/AvatarList";
import StyledScrollbar from "@Components/StyledScrollbar";
import classNames from "classnames";
import { formatMetrics } from "@Utils/formatMetrics";

export default function FullCard({
  route,
  showBadge = false,
  showMetrics = true,
  children,
}: {
  route: RouteDetail | DBFavorite | DBRecent;
  showMetrics?: boolean;
  showBadge?: boolean;
  children?: ReactNode;
}) {
  const { settings } = useSettings();
  const { title, verified, values, game } = route;
  let views: number | undefined = undefined;
  let favorites: number | undefined = undefined;
  if ("views" in route && "favorites" in route) {
    views = route.views;
    favorites = route.favorites;
  }

  return (
    <div
      className={`flex h-full w-full flex-col gap-1 rounded-lg border bg-base-200 p-2 @container ${
        route.featured && !settings.mainWindow.reducedColor
          ? "border-primary"
          : "border-transparent"
      }`}
    >
      {/* Info */}
      <div className="flex shrink-0 flex-row justify-between overflow-x-auto rounded-md bg-base-300 p-1 text-xs">
        <div className="inline-flex gap-1">
          <div
            className="inline-flex gap-0.5"
            title={new Date(route.updatedAt).toLocaleString()}
          >
            <CalendarDaysIcon className="h-4 w-4" />
            <span>{new Date(route.updatedAt).toLocaleDateString()}</span>
          </div>
          <div
            className="inline-flex gap-0.5"
            title={game === "Genshin" ? "Genshin" : "Wuthering Waves"}
          >
            <GamepadIcon className="h-4 w-4" />
            <span>{game}</span>
          </div>
        </div>
        {showMetrics && views !== undefined && favorites !== undefined && (
          <div className="inline-flex gap-1">
            <div className="inline-flex gap-0.5" title="Views">
              <EyeIcon className="h-4 w-4" />
              <span>{formatMetrics(views)}</span>
            </div>
            <div className="inline-flex gap-0.5" title="Favorites">
              <HeartIcon className="h-4 w-4" />
              <span>{formatMetrics(favorites)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex h-fit justify-between">
        <Link
          className={classNames(
            "h-6 w-full truncate pr-2 align-middle font-bold",
            {
              "relative pl-6": verified,
            }
          )}
          title={title}
          to={`/route/${route._id}`}
        >
          {verified && (
            <div className="absolute inset-y-0 left-0 flex cursor-default items-center">
              <BadgeCheckIcon className="h-6 w-6 text-green-400" />
            </div>
          )}
          {title}
        </Link>
        {showBadge && route.featured && (
          <div
            className={`badge ${
              settings.mainWindow.reducedColor
                ? "badge-outline"
                : "badge-primary"
            }`}
          >
            Featured
          </div>
        )}
      </div>
      <RouteAuthor route={route} />
      <div className="shrink-0">
        <Divider />
      </div>
      {/* Content */}
      <StyledScrollbar>
        <div className="h-[104px] max-h-[104px] text-sm grow whitespace-pre-line break-words leading-normal">
          {route.description ? (
            <Linkify
              as="pre"
              options={{ defaultProtocol: "https", target: "_blank" }}
              style={{
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
              }}
            >
              {route.description}
            </Linkify>
          ) : (
            "No description"
          )}
        </div>
      </StyledScrollbar>
      <div className="shrink-0">
        <Divider />
      </div>
      {/* Footer */}
      <div className="flex w-full items-center justify-between gap-2 flex-row">
        <div className="overflow-x-auto">
          <AvatarList values={values} />
        </div>
        <div className="flex shrink-0 gap-2">
          {children}
          <Link
            to={`/route/${route._id}`}
            className="btn-ghost btn-square btn-sm btn h-10 w-10"
            title="Start"
          >
            <PlayIcon className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
