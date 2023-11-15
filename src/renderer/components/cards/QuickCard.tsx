import { useNavigate } from "react-router-dom";

// Types
import DBFavorite from "../../db/type/DBFavorite";
import DBRecent from "../../db/type/DBRecent";

// Assets
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function QuickCard({
  route,
  recent = true,
}: {
  route: DBFavorite | DBRecent;
  recent?: boolean;
}) {
  const navigate = useNavigate();
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toLocaleDateString() === date2.toLocaleDateString();
  };

  const addedDate = new Date(route.added);
  const currentDate = new Date();
  return (
    <button
      className="btn w-full rounded-lg bg-base-200 p-2 flex flex-row gap-1 justify-center items-left"
      onClick={() => navigate(`/route/${route._id}`)}
    >
      {/* Title */}
      {route.verified && (
        <CheckBadgeIcon className="h-6 w-6 text-green-400" title="Verified" />
      )}
      <div className="truncate grow text-left" title={route.title}>
        {route.title}
      </div>
      {recent && (
        <div title={new Date(route.added).toLocaleString()}>
          {isSameDay(addedDate, currentDate)
            ? addedDate.toLocaleTimeString()
            : addedDate.toLocaleDateString()}
        </div>
      )}
    </button>
  );
}
