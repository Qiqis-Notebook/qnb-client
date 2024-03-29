import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { Outlet, useOutletContext, useLocation } from "react-router-dom";

// Assets
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function RouteLayout() {
  // Use the useLocation hook to get the current location object
  const location = useLocation();

  // Extract the query parameter from the location object
  const queryParams = new URLSearchParams(location.search);
  const queryParamValue = queryParams.get("query");

  const [value, setValue] = useState<string>(queryParamValue ?? "");
  const [query, setQuery] = useState<string>(queryParamValue ?? "");
  const [page, setPage] = useState<number>(1);

  const searchRoute = (e: FormEvent) => {
    e.preventDefault();
    setQuery(value);
    setPage(1);
  };
  return (
    <div className="flex flex-col gap-2 grow p-2">
      {/* Search bar */}
      <div className="flex items-center">
        <form className="w-full relative" onSubmit={searchRoute}>
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" className="absolute inset-y-0 right-0 px-2">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
      {/* Pages */}
      <Outlet context={{ query, page: [page, setPage] }} />
    </div>
  );
}

export function useQuery() {
  return useOutletContext<{
    query: string;
    page: [number, Dispatch<SetStateAction<number>>];
  }>();
}
