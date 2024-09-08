import { useCallback, useEffect, useId, useRef, useState } from "react";

// Types
import type { RouteDetail, RouteObject } from "@Types/Routes";
import type {
  FavoriteDeleteResponse,
  FavoriteResponse,
} from "@Types/Favorites";

// Asset
import { HeartIcon } from "lucide-react";

// Authentication
import { useAuth } from "../lib/useAuth";

// Utils
import { toast } from "react-toastify";
import { useLiveQuery } from "dexie-react-hooks";
import { favoritesTable } from "../db";

// Components
import Spinner from "./Spinner";

export default function Favorite({
  route,
}: {
  route: RouteObject | RouteDetail;
}) {
  const id = useId();

  const { session } = useAuth();
  const { status } = session;

  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const [favorite, setFavorite] = useState(false);

  // API
  const fetchFavorite = useCallback(
    async (routeId: string) => {
      return await window.electron.ipcRenderer.getData<FavoriteResponse>(
        `/api/app/favorite?id=${routeId}`,
        id,
        { tags: ["Favorite", `Favorite-${routeId}`], credentials: true }
      );
    },
    [id]
  );

  // Local save
  const localFav = useLiveQuery(() =>
    favoritesTable.where("_id").equals(route._id).toArray()
  );

  // Authenticated
  useEffect(() => {
    let mounted = true;
    if (status !== "authenticated" || loadingRef.current) return;
    setLoading(true);
    fetchFavorite(route._id)
      .then((result) => {
        if (!mounted) return;
        if (result.data.data) {
          setFavorite(true);
        } else {
          setFavorite(false);
        }
      })
      .catch(() => {
        toast.error("Unable to check favorite status");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [status, route._id, loadingRef, fetchFavorite]);

  // Un-authenticated
  useEffect(() => {
    let mounted = true;
    if (status !== "unauthenticated" || loadingRef.current) return;
    if (localFav?.length === 1) {
      setFavorite(true);
    } else {
      setFavorite(false);
    }
    setLoading(false);
    return () => {
      mounted = false;
    };
  }, [status, localFav, loadingRef, route._id]);

  async function addFavorite() {
    if (loading || status === "loading") return;
    setLoading(true);
    if (status === "authenticated") {
      try {
        const payload =
          await window.electron.ipcRenderer.getData<FavoriteResponse>(
            `/api/app/favorite?id=${route._id}`,
            id,
            { method: "POST", credentials: true, ttl: 0 }
          );
        if (payload?.data?.data) {
          window.electron.ipcRenderer.invalidate({
            tags: [`Favorite-${route._id}`],
          });
          toast.success("Added to favorites");
          setFavorite(true);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error adding route to favorites");
      }
    } else {
      await favoritesTable
        .add({
          _id: route._id,
          author: {
            displayName: route.author?.displayName || "Traveler",
            _id: route.author?._id || "",
            image: route.author?.image,
          },
          title: route.title,
          description: route.description,
          values: route.values,
          verified: route.verified,
          featured: route.featured,
          game: route.game,
          createdAt: route.createdAt,
          updatedAt: route.updatedAt,
          added: new Date(route.updatedAt),
          pinned: false,
        })
        .then(async () => {
          toast.success("Added to favorites");
          setFavorite(true);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error adding route to favorites");
        })
        .finally(() => {
          setLoading(false);
        });
    }
    setLoading(false);
  }
  async function removeFavorite() {
    if (loading || status === "loading") return;
    setLoading(true);
    if (status === "authenticated") {
      try {
        const payload =
          await window.electron.ipcRenderer.getData<FavoriteDeleteResponse>(
            `/api/app/favorite?id=${route._id}`,
            id,
            { method: "DELETE", credentials: true, ttl: 0 }
          );
        if (payload?.data?.data) {
          window.electron.ipcRenderer.invalidate({
            tags: [`Favorite-${route._id}`],
          });
          toast.success("Removed from favorites");
          setFavorite(false);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error adding route to favorites");
      }
      setLoading(false);
    } else {
      if (localFav?.length !== 1 || !localFav[0]._id) {
        setLoading(false);
        return;
      }
      await favoritesTable
        .delete(localFav[0]._id)
        .then(() => {
          toast.success("Removed from favorites");
          setFavorite(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to remove from favorites");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  if (loading)
    return (
      <button className="btn btn-square" disabled={loading}>
        <Spinner />
      </button>
    );

  return favorite ? (
    <button
      className="btn btn-square"
      title={"Remove from favorites"}
      disabled={loading}
      onClick={removeFavorite}
    >
      <HeartIcon className="fill-primary text-primary" />
    </button>
  ) : (
    <button
      className="btn btn-square"
      title={"Add to favorites"}
      disabled={loading}
      onClick={addFavorite}
    >
      <HeartIcon />
    </button>
  );
}
