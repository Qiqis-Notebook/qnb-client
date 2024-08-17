import { useState, useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";

// Types
import type { RoutesResponse } from "@Types/Routes";

// Utils
import { toast } from "react-toastify";

// Components
import { useQuery } from "@Layouts/RouteLayout";
import FullCard from "@Components/cards/FullCard";
import Pagination from "@Components/Pagination";
import Spinner from "@Components/Spinner";
import StyledScrollbar from "@Components/StyledScrollbar";

export default function SearchPage() {
  const navigate = useNavigate();

  const { query, page, game, loading } = useQuery();
  const [pageNumber, setPage] = page;
  const [loadingState, setLoadingState] = loading;
  const [data, setData] = useState<RoutesResponse | null>(null);

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
      setLoadingState(true);
      try {
        // Send a message to the main process to fetch data
        window.electron.ipcRenderer
          .getData<RoutesResponse>(apiUrl, requestId, ttl)
          .then((resp) => {
            if (isMounted) {
              if (resp.data) {
                setData(resp.data);
              } else {
                setData(fallbackData);
              }
            }
            setLoadingState(false);
          });
      } catch (error) {
        console.error("Error fetching data:", error.message);
        toast.error(error);
        if (isMounted) {
          setData(fallbackData);
        }
        setLoadingState(false);
      }
    };

    fetchData(
      query
        ? `/api/routes?query=${encodeURI(query)}${
            game ? `&game=${game}` : ""
          }&page=${pageNumber}`
        : `/gateway/routes?page=${pageNumber}${game ? `&game=${game}` : ""}`,
      id,
      query ? 0 : 300
    );
    navigate(
      `/routes/search?query=${encodeURI(query)}${
        game ? `&game=${game}` : ""
      }&page=${pageNumber}`,
      {
        replace: true,
      }
    );
    return () => {
      isMounted = false;
      window.electron.ipcRenderer.abortRequest(id);
    };
  }, [query, pageNumber, game]);

  return data && !loadingState ? (
    data.data.routes.length > 0 ? (
      <StyledScrollbar>
        <div className="flex flex-col gap-2">
          {data.data.routes.map((item, idx) => (
            <FullCard route={item} key={`fav-${idx}`} showBadge />
          ))}
          <Pagination
            totalPages={data.data.totalPages}
            currentPage={pageNumber}
            onPageChange={(pageNum) => {
              setPage(pageNum);
              setData(null);
            }}
          />
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
  );
}
