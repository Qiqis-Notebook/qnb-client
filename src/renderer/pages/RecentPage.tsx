import { Fragment, useMemo, useState } from "react";

// Types
import type { FormEvent } from "react";
interface RoutesParams {
  game?: "Genshin" | "WuWa";
  query?: string;
  page: number;
  sort?: "Favorites" | "Views";
}
const initialParams: RoutesParams = {
  game: undefined,
  query: undefined,
  page: 1,
  sort: undefined,
};

// Utils
import { useLiveQuery } from "dexie-react-hooks";
import { recentTable } from "../db";

// Asset
import { SearchIcon, TrashIcon } from "lucide-react";

// Config
import { ROUTES_PER_PAGE } from "@Config/limits";

// Components
import FullCard from "@Components/cards/FullCard";
import Pagination from "@Components/Pagination";
import StyledScrollbar from "@Components/StyledScrollbar";
import Spinner from "@Components/Spinner";
import GameSelector from "@Components/Search/GameSelector";

export default function FavoritePage() {
  const [params, setParams] = useState<RoutesParams>(initialParams);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const recent = useLiveQuery(() => recentTable.toArray()) ?? [];

  const displayRecent = useMemo(
    () =>
      recent
        ?.filter(
          (item) =>
            (params.query
              ? item.title.toLowerCase().includes(params.query.toLowerCase())
              : true) && (params.game ? item?.game === params.game : true)
        )
        .sort((a, b) => b.added.getTime() - a.added.getTime()),
    [recent, params]
  );

  async function removeRecent(_id: string) {
    if (isLoading) return;
    setIsLoading(true);
    await recentTable.delete(_id).finally(() => setIsLoading(false));
  }

  async function clearRecent() {
    if (isLoading) return;
    setIsLoading(true);
    await recentTable.clear().finally(() => setIsLoading(false));
  }

  const searchRoute = (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setParams({
      ...params,
      query: query ? query.trim() : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-2 grow p-2">
      <div className="flex w-full flex-row justify-between items-center">
        <GameSelector
          game={params.game ?? null}
          onChange={(value) => {
            setParams((prev) => ({
              ...prev,
              game: value ?? undefined,
              values: undefined,
            }));
          }}
        />
        <div>
          <button
            onClick={clearRecent}
            disabled={isLoading}
            className="btn btn-sm btn-error no-animation"
          >
            Clear
          </button>
        </div>
      </div>
      {/* Search bar */}
      <div className="flex items-center">
        <form className="w-full relative" onSubmit={searchRoute}>
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
            disabled={isLoading}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute inset-y-0 right-0 px-2"
          >
            {isLoading ? <Spinner /> : <SearchIcon className="h-6 w-6" />}
          </button>
        </form>
      </div>
      {displayRecent ? (
        displayRecent.length > 0 ? (
          <StyledScrollbar>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {displayRecent
                .slice(
                  (params.page - 1) * ROUTES_PER_PAGE,
                  params.page * ROUTES_PER_PAGE
                )
                .map((item, idx) => (
                  <FullCard route={item} key={`fav-${idx}`} showBadge>
                    <button
                      className="btn-square btn-sm btn h-10 w-10 btn-ghost"
                      title="Delete from Recent"
                      onClick={() => {
                        removeRecent(item._id);
                      }}
                      disabled={isLoading}
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </FullCard>
                ))}
              <div className="col-span-full">
                <Pagination
                  totalPages={Math.ceil(displayRecent.length / ROUTES_PER_PAGE)}
                  currentPage={params.page}
                  onPageChange={(pageNum) => {
                    setParams((prev) => ({ ...prev, page: pageNum }));
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
      )}
    </div>
  );
}
