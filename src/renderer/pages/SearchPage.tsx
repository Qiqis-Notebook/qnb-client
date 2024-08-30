import { useState, useEffect, useId } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Types
import type { FormEvent } from "react";
import type { RoutesResponse } from "@Types/Routes";
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
import { toast } from "react-toastify";

// Icons
import { SearchIcon } from "lucide-react";

// Components
import FullCard from "@Components/cards/FullCard";
import Pagination from "@Components/Pagination";
import Spinner from "@Components/Spinner";
import StyledScrollbar from "@Components/StyledScrollbar";
import GameSelector from "@Components/Search/GameSelector";
import RouteSort from "@Components/Search/RouteSort";

export default function SearchPage() {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [params, setParams] = useState<RoutesParams>({
    ...initialParams,
    query: searchParams.get("query") ?? "",
  });
  const [formData, setFormData] = useState<RoutesParams>({
    ...initialParams,
    query: searchParams.get("query") ?? "",
  });
  const [data, setData] = useState<RoutesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Component id
  const id = useId();
  const fallbackData: RoutesResponse = {
    data: {
      routes: [],
      totalPages: 0,
      totalDocuments: 0,
    },
    dt: new Date().toISOString(),
  };

  useEffect(() => {
    let isMounted = true;
    setData(null);
    const fetchData = async (
      apiUrl: string,
      requestId: string,
      ttl: number
    ) => {
      setIsLoading(true);
      try {
        // Send a message to the main process to fetch data
        window.electron.ipcRenderer
          .getData<RoutesResponse>(apiUrl, requestId, { ttl })
          .then((resp) => {
            if (isMounted) {
              if (resp.data) {
                setData(resp.data);
              } else {
                setData(fallbackData);
              }
            }
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Error fetching data:", error.message);
        toast.error(error);
        if (isMounted) {
          setData(fallbackData);
        }
        setIsLoading(false);
      }
    };

    const { query, game, page, sort } = params;

    fetchData(
      query
        ? `/api/routes?query=${encodeURI(query)}${
            game ? `&game=${game}` : ""
          }&page=${page}${sort ? `&sort=${sort}` : ""}`
        : `/gateway/routes?page=${page}${game ? `&game=${game}` : ""}${
            sort ? `&sort=${sort}` : ""
          }`,
      id,
      query ? 0 : 300
    );
    navigate(
      `/routes/search?query=${encodeURI(query)}${
        game ? `&game=${game}` : ""
      }&page=${page}`,
      {
        replace: true,
      }
    );
    return () => {
      isMounted = false;
      window.electron.ipcRenderer.abortRequest(id);
    };
  }, [params]);

  const searchRoute = (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setParams({
      ...formData,
      query: formData.query ? formData.query.trim() : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-2 grow p-2">
      <div className="flex w-full flex-row justify-between">
        <GameSelector
          game={formData.game ?? null}
          onChange={(value) => {
            setFormData((prev) => ({
              ...prev,
              game: value ?? undefined,
              values: undefined,
            }));
          }}
        />
        <RouteSort
          value={formData.sort ?? null}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, sort: value ?? undefined }));
          }}
        />
      </div>
      {/* Search bar */}
      <div className="flex items-center">
        <form className="w-full relative" onSubmit={searchRoute}>
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
            disabled={isLoading}
            value={formData.query}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                query: e.target.value,
              }))
            }
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
      {data && !isLoading ? (
        data.data.routes.length > 0 ? (
          <StyledScrollbar>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {data.data.routes.map((item, idx) => (
                <FullCard route={item} key={`fav-${idx}`} showBadge />
              ))}
              <div className="col-span-full">
                <Pagination
                  totalPages={data.data.totalPages}
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
        <div className="w-full flex justify-center items-center grow">
          <Spinner />
        </div>
      )}
    </div>
  );
}
