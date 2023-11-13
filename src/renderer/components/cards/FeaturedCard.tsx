// Types
import { RoutesObject } from "@Types/Routes";

// Assets
import {
  CalendarDaysIcon,
  CheckBadgeIcon,
  PlayIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Logo from "@Assets/qiqiLogo.png";

// Components
import Divider from "@Components/Divider";
import AvatarList from "@Components/AvatarList";

// Utils
import Linkify from "linkify-react";
import { Link } from "react-router-dom";

export default function FeaturedCard({ route }: { route: RoutesObject }) {
  const date = new Date(route.updatedAt);
  return (
    <div className="w-full h-full rounded-lg bg-base-200 p-2 flex flex-col">
      {/* Header */}
      <div className="flex flex-row gap-1">
        {/* Title */}
        {route.verified && (
          <CheckBadgeIcon className="h-6 w-6 text-green-400" title="Verified" />
        )}

        <Link
          to={`/route/${route._id}`}
          className="truncate"
          title={route.title}
        >
          {route.title}
        </Link>
      </div>
      <div className="flex flex-row">
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
      <Divider />
      {/* Content */}
      <div className="grow overflow-y-auto whitespace-pre-line break-words leading-normal">
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
      <Divider />
      {/* Footer */}
      <div className="flex items-center justify-between flex-row">
        <AvatarList values={route.values} />
        <Link
          to={`/route/${route._id}`}
          className="btn-ghost btn-square btn-sm btn"
          title="Start"
        >
          <PlayIcon className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}
