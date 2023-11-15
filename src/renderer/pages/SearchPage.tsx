import { useState, useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";

// Types
import { RoutesResponse } from "@Types/Routes";

// Utils
import { toast } from "react-toastify";

// Components
import { useQuery } from "@Layouts/RouteLayout";
import FullCard from "@Components/cards/FullCard";
import Pagination from "@Components/Pagination";
import Spinner from "@Components/Spinner";

export default function SearchPage() {
  const navigate = useNavigate();

  const { query, page } = useQuery();
  const [pageNumber, setPage] = page;
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
    const fetchData = async (apiUrl: string, requestId: string) => {
      try {
        // Send a message to the main process to fetch data
        window.electron.ipcRenderer.getData(apiUrl, requestId);

        // Listen for the response from the main process
        window.electron.ipcRenderer.dataResponse(
          (arg: {
            requestId: string;
            data?: RoutesResponse;
            error?: string;
          }) => {
            if (isMounted) {
              if (arg.data) {
                setData(arg.data);
              } else {
                setData(fallbackData);
              }
            }
          }
        );
      } catch (error) {
        console.error("Error fetching data:", error.message);
        toast.error(error);
        if (isMounted) {
          setData(fallbackData);
        }
      }
    };

    fetchData(
      query
        ? `/gateway/routes/search?q=${encodeURI(query)}&page=${pageNumber}`
        : `/gateway/routes?page=${pageNumber}`,
      id
    );
    navigate(`/routes/search?q=${encodeURI(query)}&page=${pageNumber}`, {
      replace: true,
    });
    return () => {
      isMounted = false;
      window.electron.ipcRenderer.abortRequest(id);
    };
  }, [query, pageNumber]);

  return data ? (
    data.data.routes.length > 0 ? (
      <div className="h-screen overflow-y-auto flex flex-col gap-2">
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
