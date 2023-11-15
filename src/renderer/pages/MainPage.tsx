import { useState, FormEvent, useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";

// Config
import { MAX_ROUTE_DISPLAY } from "@Config/limits";

// Types
import { RouteListResponse, RouteDetail } from "@Types/Routes";
import DBFavorite from "../db/type/DBFavorite";
import DBRecent from "../db/type/DBRecent";

// Utils
import { favoritesTable, recentTable } from "../db";
import { toast } from "react-toastify";

// Components
import Spinner from "@Components/Spinner";
import Divider from "@Components/Divider";
import FullCard from "@Components/cards/FullCard";
import QuickCard from "@Components/cards/QuickCard";
import FullCardSkeleton from "@Components/skeleton/FullCardSkeleton";

export default function MainPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState<RouteDetail[] | null>(null);
  const [favorite, setFavorite] = useState<DBFavorite[] | null>(null);
  const [recent, setRecent] = useState<DBRecent[] | null>(null);

  // Component id
  const id = useId();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/routes/search?q=${encodeURI(query)}`);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async (apiUrl: string, requestId: string) => {
      try {
        // Send a message to the main process to fetch data
        window.electron.ipcRenderer.getData(apiUrl, requestId);

        // Listen for the response from the main process
        window.electron.ipcRenderer.dataResponse(
          (arg: {
            requestId: string;
            data?: RouteListResponse;
            error?: string;
          }) => {
            if (isMounted) {
              if (arg.data) {
                setFeatured(arg.data.data);
              } else {
                setFeatured([]);
              }
            }
          }
        );
      } catch (error) {
        console.error("Error fetching data:", error.message);
        toast.error(error);
        if (isMounted) {
          setFeatured([]);
        }
      }
    };
    const fetchFavorites = async () => {
      const favorites = await favoritesTable.toArray();
      const sortedFavorites = favorites.sort((a, b) => {
        if (a.pinned === b.pinned) {
          return b.added.getTime() - a.added.getTime();
        }
        return a.pinned ? -1 : 1;
      });
      return sortedFavorites.slice(0, MAX_ROUTE_DISPLAY);
    };
    const fetchRecent = async () => {
      return await recentTable
        .orderBy("added")
        .reverse()
        .limit(MAX_ROUTE_DISPLAY)
        .toArray();
    };

    fetchData("/gateway/featured-routes", id);
    Promise.all([fetchFavorites(), fetchRecent()])
      .then(([favoritesData, recentData]) => {
        if (isMounted) {
          setFavorite(favoritesData);
          setRecent(recentData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        toast.error(error);
      });

    return () => {
      isMounted = false;
      window.electron.ipcRenderer.abortRequest(id);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 grow p-2 overflow-y-auto">
      <div className="flex items-center">
        <form className="w-full" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
      {/* Featured */}
      <div className="h-auto">
        <div className="w-full text-center">Featured Routes</div>
        <Divider />
        {featured === null ? (
          <div className="grid items-start gap-3 grid-cols-3 h-60">
            <FullCardSkeleton />
            <FullCardSkeleton />
            <FullCardSkeleton />
          </div>
        ) : featured.length > 0 ? (
          <div className="grid items-start gap-3 grid-cols-3 h-60">
            {featured.map((item, idx) => (
              <FullCard route={item} key={`fr-${idx}`} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-base-200 h-60 flex items-center justify-center">
            No Data
          </div>
        )}
      </div>
      {/* Quick routes */}
      <div className="w-full grid grid-cols-2 gap-2 grow">
        <div className="flex flex-col h-full">
          <div className="w-full text-center">Favorite</div>
          <Divider />
          {favorite === null ? (
            <div></div>
          ) : favorite.length > 0 ? (
            <div className="gap-2 flex flex-col">
              {favorite.map((item, idx) => (
                <QuickCard route={item} key={`fav-${idx}`} recent={false} />
              ))}
            </div>
          ) : (
            <div className="text-center">No Favorites</div>
          )}
        </div>
        <div className="h-full">
          <div className="w-full text-center">Recent</div>
          <Divider />
          {recent === null ? (
            <div></div>
          ) : recent.length > 0 ? (
            <div className="flex flex-col gap-2">
              {recent.map((item, idx) => (
                <QuickCard route={item} key={`rec-${idx}`} />
              ))}
            </div>
          ) : (
            <div className="text-center">No Recent</div>
          )}
        </div>
      </div>
    </div>
  );
}
