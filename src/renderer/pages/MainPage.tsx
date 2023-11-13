import { useState, FormEvent, useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";

// Config
import { isDev } from "@Config/constants";

// Types
import { RoutesResponse, RoutesObject } from "@Types/Routes";

// Components
import { toast } from "react-toastify";
import Spinner from "@Components/Spinner";
import Divider from "@Components/Divider";
import FeaturedCard from "@Components/cards/FeaturedCard";

export default function MainPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<RoutesObject[]>([]);
  const [loading, setLoading] = useState(true);

  const id = useId();

  console.log(isDev);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/routes/search?q=${encodeURI(query)}`);
  };

  useEffect(() => {
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
            if (arg.data) {
              setData(arg.data.data);
            }
          }
        );
      } catch (error) {
        console.error("Error fetching data:", error.message);
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    // Example usage with a unique requestId
    fetchData("/gateway/featured-routes", id);

    return () => {
      window.electron.ipcRenderer.abortRequest(id);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 grow p-2">
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
        {loading ? (
          <div className="h-full w-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid items-start gap-3 grid-cols-3 h-60">
            {data.length >= 0 ? (
              data.map((item, idx) => (
                <FeaturedCard route={item} key={`fr-${idx}`} />
              ))
            ) : (
              <div>No Data</div>
            )}
          </div>
        )}
      </div>
      {/* Quick routes */}
      <div className="grow"></div>
    </div>
  );
}
