import { ReactNode } from "react";

// Context
import { useSettings } from "@Context/SettingsContext";

// Types
import type { RouteDetail } from "@Types/Routes";
import type DBFavorite from "../../db/type/DBFavorite";
import type DBRecent from "../../db/type/DBRecent";

// Assets
import { BadgeCheckIcon, PlayIcon } from "lucide-react";

// Utils
import Linkify from "linkify-react";
import { Link } from "react-router-dom";

// Components
import RouteAuthor from "@Components/RouteAuthor";
import Divider from "@Components/Divider";
import AvatarList from "@Components/AvatarList";
import StyledScrollbar from "@Components/StyledScrollbar";

export default function FullCard({
  route,
  showBadge = false,
  children,
}: {
  route: RouteDetail | DBFavorite | DBRecent;
  showBadge?: boolean;
  children?: ReactNode;
}) {
  const { settings } = useSettings();

  return (
    <div
      className={`w-full h-full rounded-lg bg-base-200 p-2 flex gap-1 flex-col border ${
        route.featured && !settings.mainWindow.reducedColor
          ? "border-primary"
          : "border-transparent"
      }`}
    >
      {/* Header */}
      <div className="flex flex-row gap-1">
        {route.verified && (
          <BadgeCheckIcon className="h-6 w-6 text-green-400 shrink-0" />
        )}
        <Link
          to={`/route/${route._id}`}
          className="truncate grow"
          title={route.title}
        >
          {route.title}
        </Link>
        {showBadge && route.featured && (
          <div className="badge badge-primary">Featured</div>
        )}
      </div>
      <RouteAuthor route={route} />
      <Divider />
      {/* Content */}
      <StyledScrollbar>
        <div className="h-[100px] max-h-[100px] text-sm grow whitespace-pre-line break-words leading-normal">
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
      <Divider />
      {/* Footer */}
      <div className="flex items-center justify-between flex-row">
        <div className="grow">
          <AvatarList values={route.values} />
        </div>
        <div className="flex gap-2">
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
