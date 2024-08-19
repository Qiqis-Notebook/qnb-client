import {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useId,
  Fragment,
  useRef,
} from "react";

// Types
import type { RoutesResponse } from "@Types/Routes";

// Assets
import { RefreshCwIcon } from "lucide-react";

// Config
import { useSettings } from "@Context/SettingsContext";
import { ROUTES_PER_PAGE } from "@Config/limits";

// Authentication
import { useAuth } from "../lib/useAuth";

// Utils
import { useLiveQuery } from "dexie-react-hooks";
import { favoritesTable } from "../db";
import { toast } from "react-toastify";
import classNames from "classnames";

// Components
import Pagination from "@Components/Pagination";
import StyledScrollbar from "@Components/StyledScrollbar";
import TimeoutButton from "@Components/TimeoutButton";
import LocalFavoriteCard from "@Components/cards/Favorites/Local";
import AccountFavoriteCard from "@Components/cards/Favorites/Account";

export default function FavoritePage() {
  // Component id
  const id = useId();

  const { settings } = useSettings();
  const { session } = useAuth();
  const { status } = session;
  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [local, setLocal] = useState(
    status === "unauthenticated" ? true : false
  );
  useEffect(() => {
    switch (status) {
      case "authenticated":
        setLocal(false);
        break;
      case "unauthenticated":
        setLocal(true);
        break;
      default:
        setLocal(true);
        break;
    }
  }, [status]);

  // Local data
  const favorites = useLiveQuery(() => favoritesTable.toArray());
  const favoriteCount = useMemo(
    () => favorites?.filter((item) => item.pinned === true).length,
    [favorites]
  );
  const localData = useMemo(() => {
    const data = favorites?.sort((a, b) => {
      if (a.pinned === b.pinned) {
        return b.added.getTime() - a.added.getTime();
      }
      return a.pinned ? -1 : 1;
    });
    return data?.slice(0, ROUTES_PER_PAGE);
  }, [favorites]);

  // Favorite routes
  const [fetching, setFetching] = useState(false);
  const [favoritesData, setFavoritesData] = useState<RoutesResponse | null>(
    null
  );
  const getFavoriteRoutes = useCallback(
    async (page: number) => {
      try {
        // Send a message to the main process to fetch data
        const payload =
          await window.electron.ipcRenderer.getData<RoutesResponse>(
            `/api/app/favorites/user?page=${page}`,
            id,
            { credentials: true, tags: ["Favorites"] }
          );
        if (!payload.data) {
          return null;
        }
        return payload.data;
      } catch (error) {
        return null;
      }
    },
    [id]
  );
  useEffect(() => {
    if (local || statusRef.current !== "authenticated") return;
    setFetching(true);
    getFavoriteRoutes(page)
      .then((resp) => {
        setFavoritesData(resp);
      })
      .catch(() => {
        toast.error("Failed to get favorites");
      })
      .finally(() => {
        setFetching(false);
      });
  }, [local, page, statusRef, getFavoriteRoutes]);

  // Total pages
  const pages = useMemo(
    () =>
      local
        ? localData
          ? Math.ceil(localData.length / ROUTES_PER_PAGE)
          : 1
        : favoritesData
        ? favoritesData.data.totalPages
        : 1,
    [local, localData, favoritesData]
  );

  // Refresh
  async function refresh() {
    if (loading) return;
    setLoading(true);
    try {
      // Invalidate favorites
      window.electron.ipcRenderer.invalidate({ tags: ["Favorites"] });

      const payload = await getFavoriteRoutes(1);
      setFavoritesData(payload);
      setPage(1);
    } catch (error) {
      toast.error("Failed to get favorites");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2 grow p-2">
      <div className="inline-flex justify-between w-full items-center">
        <div role="tablist" className="tabs-boxed tabs w-64 grid-cols-2">
          <button
            role="tab"
            className={classNames(
              "tab col-span-1",
              {
                "bg-primary":
                  local === false && !settings.mainWindow.reducedColor,
              },
              {
                "bg-base-300":
                  local === false && settings.mainWindow.reducedColor,
              }
            )}
            onClick={() => setLocal(false)}
            disabled={status !== "authenticated" || loading}
          >
            Account
          </button>
          <button
            role="tab"
            className={classNames(
              "tab col-span-1",
              {
                "bg-primary":
                  local === true && !settings.mainWindow.reducedColor,
              },
              {
                "bg-base-300":
                  local === true && settings.mainWindow.reducedColor,
              }
            )}
            onClick={() => setLocal(true)}
            disabled={loading}
          >
            Local
          </button>
        </div>
        {!local && (
          <TimeoutButton
            className="btn btn-square btn-sm"
            timeOut={5}
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCwIcon />
          </TimeoutButton>
        )}
      </div>
      {status !== "loading" && (
        <StyledScrollbar>
          {local ? (
            <Fragment>
              {localData ? (
                <Fragment>
                  {localData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      {localData
                        .slice(
                          (page - 1) * ROUTES_PER_PAGE,
                          page * ROUTES_PER_PAGE
                        )
                        .map((item, idx) => (
                          <LocalFavoriteCard
                            key={`local-route-${idx}-${item._id}`}
                            route={item}
                            allowPin={favoriteCount < 5}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="divider mb-4 mt-6">No result</div>
                  )}
                </Fragment>
              ) : (
                <div className="flex justify-center">
                  <span className="loading loading-dots loading-lg"></span>
                </div>
              )}
            </Fragment>
          ) : (
            <Fragment>
              {fetching && (
                <div className="flex justify-center">
                  <span className="loading loading-dots loading-lg"></span>
                </div>
              )}
              {!fetching &&
                favoritesData &&
                favoritesData.data.totalDocuments > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {favoritesData.data.routes
                      .slice(
                        (page - 1) * ROUTES_PER_PAGE,
                        page * ROUTES_PER_PAGE
                      )
                      .map((item, idx) => (
                        <AccountFavoriteCard
                          key={`cloud-route-${idx}-${item._id}`}
                          allowPin={favoriteCount < 5}
                          route={item}
                          onDelete={(routeId) => {
                            setFavoritesData((prev) => ({
                              ...prev,
                              data: {
                                ...prev.data,
                                routes: prev.data.routes.filter(
                                  (item) => item._id !== routeId
                                ),
                                totalDocuments: prev.data.totalDocuments - 1,
                                totalPages: prev.data.totalPages - 1,
                              },
                            }));
                          }}
                        />
                      ))}
                  </div>
                )}
              {!fetching &&
                (!favoritesData ||
                  favoritesData?.data.totalDocuments === 0) && (
                  <div className="divider mb-4 mt-6">
                    {favoritesData ? "No result" : "Error"}
                  </div>
                )}
            </Fragment>
          )}
          <Pagination
            totalPages={pages}
            currentPage={page}
            onPageChange={(pageNum) => {
              if (loading) return;
              setPage(pageNum);
            }}
          />
        </StyledScrollbar>
      )}
    </div>
  );
}
