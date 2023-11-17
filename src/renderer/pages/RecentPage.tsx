import { useMemo, useState } from "react";

// Utils
import { useLiveQuery } from "dexie-react-hooks";
import { recentTable } from "../db";

// Asset
import { TrashIcon } from "@heroicons/react/24/outline";

// Components
import { useQuery } from "@Layouts/RouteLayout";
import FullCard from "@Components/cards/FullCard";
import StyledScrollbar from "@Components/StyledScrollbar";

export default function FavoritePage() {
  const { query } = useQuery();
  const recent = useLiveQuery(() => recentTable.toArray());

  const displayRecent = useMemo(
    () =>
      recent?.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      ),
    [recent, query]
  );

  const [loading, setLoading] = useState(false);
  async function removeRecent(_id: string) {
    if (loading) return;
    setLoading(true);
    await recentTable.delete(_id).finally(() => setLoading(false));
  }

  return (
    displayRecent &&
    (displayRecent.length > 0 ? (
      <StyledScrollbar>
        <div className="flex flex-col gap-2">
          {displayRecent.map((item, idx) => (
            <FullCard route={item} key={`fav-${idx}`} showBadge>
              <button
                className="btn-square btn-sm btn h-10 w-10 btn-ghost"
                title="Delete from Recent"
                onClick={() => {
                  removeRecent(item._id);
                }}
                disabled={loading}
              >
                <TrashIcon className="h-6 w-6" />
              </button>
            </FullCard>
          ))}
        </div>
      </StyledScrollbar>
    ) : (
      <div className="w-full rounded-lg bg-base-200 p-2 text-center">
        <p>No routes</p>
      </div>
    ))
  );
}
