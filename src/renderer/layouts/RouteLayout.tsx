import { useState, FormEvent } from "react";
import { Outlet, useOutletContext, useLocation } from "react-router-dom";

export default function RouteLayout() {
  // Use the useLocation hook to get the current location object
  const location = useLocation();

  // Extract the query parameter from the location object
  const queryParams = new URLSearchParams(location.search);
  const queryParamValue = queryParams.get("q");

  const [query, setQuery] = useState(queryParamValue ?? "");

  const searchRoute = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className="flex flex-col gap-2 grow p-2">
      {/* Search bar */}
      <div className="flex items-center">
        <form className="w-full" onSubmit={searchRoute}>
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
      {/* Pages */}
      <Outlet context={{ query }} />
    </div>
  );
}

export function useQuery() {
  return useOutletContext<string>();
}
