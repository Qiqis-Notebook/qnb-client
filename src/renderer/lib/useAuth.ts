import { useCallback } from "react";

// Components
import { toast } from "react-toastify";
import { setSession, useAuthController } from "@Context/AuthContext";

export const useAuth = () => {
  const [controller, dispatch] = useAuthController();
  const { session } = controller;

  const signOut = useCallback(async () => {
    if (session.status !== "authenticated") return;
    setSession(dispatch, { user: session.user, status: "loading" });

    try {
      const success = await window.electron.ipcRenderer.logout();
      if (success) {
        window.electron.ipcRenderer.invalidate({
          tags: ["Favorites", "Favorite"],
        });
        setSession(dispatch, { user: null, status: "unauthenticated" });
      } else {
        toast.error("Failed to sign out");
        setSession(dispatch, { user: session.user, status: "authenticated" });
      }
    } catch (error) {
      setSession(dispatch, { user: session.user, status: "authenticated" });
    }
  }, [session, dispatch]);

  return { session, signOut };
};
