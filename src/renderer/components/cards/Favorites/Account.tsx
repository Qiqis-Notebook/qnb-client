import { useState, useId } from "react";

// Types
import type { RoutesObject, RoutesResponse } from "@Types/Routes";

// Assets
import { TrashIcon, PinIcon, SaveIcon } from "lucide-react";

// Utils
import { useLiveQuery } from "dexie-react-hooks";
import { favoritesTable } from "../../../db";
import { toast } from "react-toastify";

// Components
import FullCard from "@Components/cards/FullCard";

export default function AccountFavoriteCard({
  route,
  allowPin,
  onDelete = () => {},
}: {
  route: RoutesObject;
  allowPin: boolean;
  onDelete: (id: string) => void;
}) {
  const id = useId();
  const matched = useLiveQuery(() =>
    favoritesTable.where("_id").equals(route._id).toArray()
  );

  const [loading, setLoading] = useState(false);
  async function removeCloud(routeId: string) {
    if (loading) return;
    setLoading(true);
    try {
      const payload = await window.electron.ipcRenderer.getData<RoutesResponse>(
        `/api/app/favorite?id=${routeId}`,
        id,
        { method: "DELETE", credentials: true }
      );
      if (!payload.data) {
        throw new Error("Request failed");
      }

      // Invalidate favorites
      window.electron.ipcRenderer.invalidate({
        tags: ["Favorites", `Favorite-${routeId}`],
      });
      onDelete(routeId);

      toast.success("Removed from favorites");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from favorites");
    }
    setLoading(false);
  }
  async function pinCloud(route: RoutesObject) {
    if (!allowPin) {
      toast.warn("Pinned limit reached");
      return;
    }
    const pinned = await addCloudToLocal(route, true);
    if (!pinned) {
      return;
    }
  }
  async function addCloudToLocal(route: RoutesObject, pin?: boolean) {
    try {
      const duplicate = await favoritesTable.get(route._id);
      if (duplicate) {
        await favoritesTable.update(route._id, { pinned: true });
        toast.success("Pinned to local");
        return true;
      }
      await favoritesTable.add({
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
        pinned: pin ?? false,
      });
      if (pin) {
        toast.success("Pinned to local");
      } else {
        toast.success("Saved to local");
      }
      return true;
    } catch (error) {
      toast.error("Unable to save route to local");
      console.error(error);
      return false;
    }
  }

  return (
    <FullCard route={route} showBadge>
      <button
        className="btn btn-square btn-ghost btn-sm h-10 w-10"
        title="Delete"
        onClick={() => removeCloud(route._id)}
        disabled={loading}
      >
        <TrashIcon className="h-6 w-6" />
      </button>
      <button
        className="btn btn-square btn-ghost btn-sm h-10 w-10"
        title="Save to local"
        onClick={() => {
          addCloudToLocal(route);
        }}
        disabled={loading || !matched || matched.length !== 0}
      >
        <SaveIcon className="h-6 w-6" />
      </button>
      <button
        className="btn-square btn-sm btn h-10 w-10 btn-ghost"
        title="Pin to local"
        onClick={() => {
          pinCloud(route);
        }}
        disabled={
          !allowPin || !matched || (matched.length > 0 && matched[0].pinned)
        }
      >
        <PinIcon className="h-6 w-6" />
      </button>
    </FullCard>
  );
}
