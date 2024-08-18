import { useState, FormEvent, Dispatch, SetStateAction, useId } from "react";
import {
  Outlet,
  useOutletContext,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Types
import type { RouteVanityResponse } from "@Types/Routes";

// Assets
import { SearchIcon } from "lucide-react";

// Utils
import { toast } from "react-toastify";
import Spinner from "@Components/Spinner";

export default function RouteLayout() {
  const navigate = useNavigate();
  // Use the useLocation hook to get the current location object
  const location = useLocation();

  // Extract the query parameter from the location object
  const queryParams = new URLSearchParams(location.search);
  const queryParamValue = queryParams.get("query");
  const queryParamGame = queryParams.get("game");

  const [value, setValue] = useState<string>(queryParamValue ?? "");
  const [query, setQuery] = useState<string>(queryParamValue ?? "");
  const [game, setGame] = useState<string | null>(queryParamGame ?? null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // Component id
  const id = useId();

  const searchRoute = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const queryString = value.trim();
    // No search
    if (queryString.length === 0) {
      setQuery("");
      setPage(1);
      return;
    }
    const regexId =
      /^(?:https:\/\/(www\.)?qiqis-notebook\.com\/route\/)?([0-9a-fA-F]{24})$/;
    let match = queryString.match(regexId);

    // If it's a route id, launch the route
    if (match) {
      navigate(`/route/${match[2]}`);
    } else {
      // If it's a route vanity, get route id and launch the route
      const regexVanity =
        /^(?:https:\/\/(www\.)?qiqis-notebook\.com\/r\/)([a-zA-Z0-9-_.]{1,50})$/;
      match = queryString.match(regexVanity);
      if (match) {
        // Resolve vanity link
        setLoading(true);
        try {
          setQuery("");
          // Send a message to the main process to fetch data
          window.electron.ipcRenderer
            .getData<RouteVanityResponse>(
              `/gateway/vanity/route?vanity=${match[2]}`,
              id
            )
            .then((resp) => {
              if (resp && resp.data) {
                const vanityId = resp.data.data._id;
                setLoading(false);
                navigate(`/route/${vanityId}`);
              } else {
                setLoading(false);
                toast.error("Route not found");
              }
            });
        } catch (error) {
          console.error("Error fetching data:", error.message);
          toast.error(error);
          setLoading(false);
        }
      } else {
        // Route query
        setQuery(value);
        setPage(1);
      }
    }
  };
  return (
    <div className="flex flex-col gap-2 grow p-2">
      {/* Game selector */}
      <div className="flex flex-row gap-2 p-2">
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="radio-genshin"
              className="radio"
              disabled={loading}
              checked={game === null}
              onChange={(e) => {
                if (!e.currentTarget.checked) return;
                setGame(null);
                setPage(1);
              }}
            />
            <span className="label-text">All</span>
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="radio-genshin"
              className="radio"
              disabled={loading}
              checked={game === "Genshin"}
              onChange={(e) => {
                if (!e.currentTarget.checked) return;
                setGame("Genshin");
                setPage(1);
              }}
            />
            <span className="label-text">Genshin</span>
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="radio-wuwa"
              className="radio"
              disabled={loading}
              checked={game === "WuWa"}
              onChange={(e) => {
                if (!e.currentTarget.checked) return;
                setGame("WuWa");
                setPage(1);
              }}
            />
            <span className="label-text">Wuthering Waves</span>
          </label>
        </div>
      </div>
      {/* Search bar */}
      <div className="flex items-center">
        <form className="w-full relative" onSubmit={searchRoute}>
          <input
            type="text"
            placeholder="Search title/id/url"
            className="input input-bordered w-full"
            disabled={loading}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute inset-y-0 right-0 px-2"
          >
            {loading ? <Spinner /> : <SearchIcon className="h-6 w-6" />}
          </button>
        </form>
      </div>
      {/* Pages */}
      <Outlet
        context={{
          query,
          page: [page, setPage],
          game,
          loading: [loading, setLoading],
        }}
      />
    </div>
  );
}

export function useQuery() {
  return useOutletContext<{
    query: string;
    page: [number, Dispatch<SetStateAction<number>>];
    game: "Genshin" | "WuWa" | null;
    loading: [boolean, Dispatch<SetStateAction<boolean>>];
  }>();
}
