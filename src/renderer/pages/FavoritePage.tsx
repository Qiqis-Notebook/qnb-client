import { useMemo, useState } from "react";

// Assets
import { BarsArrowUpIcon, TrashIcon } from "@heroicons/react/24/outline";

// Config
import { MAX_ROUTE_DISPLAY, ROUTES_PER_PAGE } from "@Config/limits";

// Utils
import { useLiveQuery } from "dexie-react-hooks";
import { favoritesTable } from "../db";
import { toast } from "react-toastify";

// Components
import { useQuery } from "@Layouts/RouteLayout";
import FullCard from "@Components/cards/FullCard";
import Pagination from "@Components/Pagination";
import StyledScrollbar from "@Components/StyledScrollbar";

export default function FavoritePage() {
  const { query, page } = useQuery();
  const [pageNumber, setPage] = page;
  const favorites = useLiveQuery(() => favoritesTable.toArray());

  const favoriteCount = useMemo(
    () => favorites?.filter((item) => item.pinned === true).length,
    [favorites]
  );
  const sortedFavorites = useMemo(() => {
    const sortedFavorites = favorites?.sort((a, b) => {
      if (a.pinned === b.pinned) {
        return b.added.getTime() - a.added.getTime();
      }
      return a.pinned ? -1 : 1;
    });
    return sortedFavorites?.slice(0, ROUTES_PER_PAGE);
  }, [favorites]);
  const displayFavorites = useMemo(
    () =>
      sortedFavorites?.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      ),
    [sortedFavorites, query]
  );

  const updatePinnedStatus = async (_id: string, newPinnedStatus: boolean) => {
    if (newPinnedStatus && favoriteCount >= MAX_ROUTE_DISPLAY) {
      toast.warn("Pinned limit reached");
      return;
    }
    try {
      await favoritesTable.update(_id, { pinned: newPinnedStatus });
    } catch (error) {
      console.error("Error updating pinned status:", error);
    }
  };

  const [loading, setLoading] = useState(false);
  async function removeFavorite(_id: string) {
    if (loading) return;
    setLoading(true);
    await favoritesTable.delete(_id).finally(() => setLoading(false));
  }
  return (
    <StyledScrollbar>
      {displayFavorites &&
        (displayFavorites.length > 0 ? (
          <div className="flex flex-col gap-2">
            {displayFavorites
              .slice(
                (pageNumber - 1) * ROUTES_PER_PAGE,
                pageNumber * ROUTES_PER_PAGE
              )
              .map((item, idx) => (
                <FullCard route={item} key={`fav-${idx}`} showBadge>
                  <button
                    className="btn-square btn-sm btn h-10 w-10 btn-ghost"
                    title="Delete from Recent"
                    onClick={() => {
                      removeFavorite(item._id);
                    }}
                    disabled={loading}
                  >
                    <TrashIcon className="h-6 w-6" />
                  </button>
                  <button
                    className={`btn-square btn-sm btn h-10 w-10 ${
                      item.pinned ? "btn-primary" : "btn-ghost"
                    }`}
                    title={item.pinned ? "Unpin from top" : "Pin to top"}
                    onClick={() => {
                      updatePinnedStatus(item._id, !item.pinned);
                    }}
                    disabled={
                      !item.pinned && favoriteCount >= MAX_ROUTE_DISPLAY
                    }
                  >
                    <BarsArrowUpIcon className="h-6 w-6" />
                  </button>
                </FullCard>
              ))}
            <Pagination
              totalPages={displayFavorites.length / ROUTES_PER_PAGE}
              currentPage={pageNumber}
              onPageChange={(pageNum) => {
                setPage(pageNum);
              }}
            />
          </div>
        ) : (
          <div className="w-full rounded-lg bg-base-200 p-2 text-center">
            <p>No routes</p>
          </div>
        ))}
    </StyledScrollbar>
  );
}
