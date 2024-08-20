import { useMemo, useState } from "react";

// Utils
import { useLiveQuery } from "dexie-react-hooks";
import { recentTable } from "../db";

// Asset
import { TrashIcon } from "lucide-react";

// Config
import { ROUTES_PER_PAGE } from "@Config/limits";

// Components
import { useQuery } from "@Layouts/RouteLayout";
import FullCard from "@Components/cards/FullCard";
import Pagination from "@Components/Pagination";
import StyledScrollbar from "@Components/StyledScrollbar";
import Spinner from "@Components/Spinner";

export default function FavoritePage() {
  const {
    query,
    game,
    page: [page, setPage],
  } = useQuery();
  const recent = useLiveQuery(() => recentTable.toArray()) ?? [];

  const displayRecent = useMemo(
    () =>
      recent
        ?.filter(
          (item) =>
            (item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase())) &&
            (game ? item.game === game : true)
        )
        .sort((a, b) => b.added.getTime() - a.added.getTime()),
    [recent, query, game]
  );

  const [loading, setLoading] = useState(false);
  async function removeRecent(_id: string) {
    if (loading) return;
    setLoading(true);
    await recentTable.delete(_id).finally(() => setLoading(false));
  }

  return displayRecent ? (
    displayRecent.length > 0 ? (
      <StyledScrollbar>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {displayRecent
            .slice((page - 1) * ROUTES_PER_PAGE, page * ROUTES_PER_PAGE)
            .map((item, idx) => (
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
          <div className="col-span-full">
            <Pagination
              totalPages={Math.ceil(displayRecent.length / ROUTES_PER_PAGE)}
              currentPage={page}
              onPageChange={(pageNum) => {
                setPage(pageNum);
              }}
            />
          </div>
        </div>
      </StyledScrollbar>
    ) : (
      <div className="w-full rounded-lg bg-base-200 p-2 text-center">
        <p>No routes</p>
      </div>
    )
  ) : (
    <div className="w-full grow justify-center items-center flex">
      <Spinner />
    </div>
  );
}
