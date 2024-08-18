import { useEffect, useState } from "react";

// Asset
import { StarIcon } from "lucide-react";

// Types
import type { RouteDetail, RouteObject } from "@Types/Routes";
import type DBFavorite from "../db/type/DBFavorite";

// Utils
import { toast } from "react-toastify";
import { useLiveQuery } from "dexie-react-hooks";
import { favoritesTable } from "../db";

export default function Favorite({
  routeDetail,
}: {
  routeDetail: RouteObject | RouteDetail;
}) {
  const [loading, setLoading] = useState(false);
  const [favorite, setFavorite] = useState<DBFavorite | null>(null);
  const fav = useLiveQuery(() =>
    favoritesTable.where("_id").equals(routeDetail._id).toArray()
  );
  useEffect(() => {
    if (!fav) return;
    setFavorite(fav[0]);
  }, [fav]);

  if (!fav) return <></>;

  return favorite ? (
    <button
      className="btn btn-square"
      title="Unfavorite"
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        const deleteId = favorite._id;
        await favoritesTable
          .delete(deleteId)
          .then(() => {
            setFavorite(null);
          })
          .catch((error) => {
            console.error(error);
            toast.error("Failed to remove from favorites");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      <StarIcon className="fill-primary text-primary" />
    </button>
  ) : (
    <button
      className="btn btn-square"
      title="Favorite"
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        await favoritesTable
          .add({
            ...routeDetail,
            added: new Date(),
            pinned: false,
          })
          .catch((error) => {
            console.error(error);
            toast.error("Error adding route to favorites");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      <StarIcon />
    </button>
  );
}
