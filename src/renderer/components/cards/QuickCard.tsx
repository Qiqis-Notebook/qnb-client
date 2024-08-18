import { useNavigate } from "react-router-dom";

// Context
import { useSettings } from "@Context/SettingsContext";

// Types
import type DBFavorite from "../../db/type/DBFavorite";
import type DBRecent from "../../db/type/DBRecent";

// Assets
import { BadgeCheckIcon } from "lucide-react";

export default function QuickCard({
  route,
  recent = true,
}: {
  route: DBFavorite | DBRecent;
  recent?: boolean;
}) {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toLocaleDateString() === date2.toLocaleDateString();
  };

  const addedDate = new Date(route.added);
  const currentDate = new Date();
  return (
    <button
      className={`btn w-full rounded-lg bg-base-200 p-2 flex flex-row flex-nowrap justify-center items-left ${
        route.featured &&
        !settings.mainWindow.reducedColor &&
        "border border-primary"
      }`}
      onClick={() => navigate(`/route/${route._id}`)}
    >
      {/* Title */}
      {route.verified && <BadgeCheckIcon className="h-6 w-6 text-green-400" />}
      <div className="grow truncate text-left" title={route.title}>
        {route.title}
      </div>
      {recent && (
        <div
          title={new Date(route.added).toLocaleString()}
          className="shrink-0"
        >
          {isSameDay(addedDate, currentDate)
            ? addedDate.toLocaleTimeString()
            : addedDate.toLocaleDateString()}
        </div>
      )}
    </button>
  );
}
