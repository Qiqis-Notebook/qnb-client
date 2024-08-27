import { useState } from "react";

// Types
import type DBFavorite from "../../../db/type/DBFavorite";

// Assets
import { TrashIcon, PinIcon } from "lucide-react";

// Utils
import { favoritesTable } from "../../../db";
import { toast } from "react-toastify";

// Components
import FullCard from "@Components/cards/FullCard";
import { useSettings } from "@Context/SettingsContext";

export default function LocalFavoriteCard({
  route,
  allowPin,
}: {
  route: DBFavorite;
  allowPin: boolean;
}) {
  const { settings } = useSettings();

  const [loading, setLoading] = useState(false);

  // Pin favorite
  const updatePinnedStatus = async (_id: string, newPinnedStatus: boolean) => {
    if (newPinnedStatus && !allowPin) {
      toast.warn("Pinned limit reached");
      return;
    }
    try {
      await favoritesTable.update(_id, { pinned: newPinnedStatus });
    } catch (error) {
      console.error("Error updating pinned status:", error);
    }
  };

  async function removeLocal(id?: string) {
    if (!id || loading) return;
    setLoading(true);
    await favoritesTable
      .delete(id)
      .then(() => {
        toast.success("Removed from favorites");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to remove from favorites");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <FullCard route={route} showBadge showMetrics={false}>
      <button
        className="btn btn-square btn-ghost btn-sm h-10 w-10"
        title="Delete"
        onClick={() => removeLocal(route._id)}
        disabled={loading}
      >
        <TrashIcon className="h-6 w-6" />
      </button>
      <button
        className={`btn-square btn-sm btn h-10 w-10 ${
          route.pinned
            ? settings.mainWindow.reducedColor
              ? "bg-primary/20"
              : "btn-primary"
            : "btn-ghost"
        }`}
        title={route.pinned ? "Unpin from top" : "Pin to top"}
        onClick={() => {
          updatePinnedStatus(route._id, !route.pinned);
        }}
        disabled={!route.pinned && !allowPin}
      >
        <PinIcon className="h-6 w-6" />
      </button>
    </FullCard>
  );
}
