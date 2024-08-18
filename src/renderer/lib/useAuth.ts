import { useCallback, useEffect } from "react";

// Types
interface AuthUser {
  id: string;
  name: string;
  image: string;
  authAvatar: string;
}

// Components
import { toast } from "react-toastify";
import { setSession, useAuthController } from "@Context/AuthContext";

export const useAuth = () => {
  const [controller, dispatch] = useAuthController();
  const { session } = controller;

  const checkSession = useCallback(async () => {
    try {
      const payload = await window.electron.ipcRenderer.session();
      return payload;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    setSession(dispatch, { user: null, status: "loading" });

    // Listen to auth events
    window.electron.ipcRenderer.on("auth", (arg: AuthUser | null) => {
      if (!mounted || !arg) return;
      setSession(dispatch, { user: arg, status: "authenticated" });
    });

    // Trigger session check
    checkSession().then((resp) => {
      if (!mounted) return;
      if (resp) {
        setSession(dispatch, { user: resp, status: "authenticated" });
      } else {
        setSession(dispatch, { user: null, status: "unauthenticated" });
      }
    });
    return () => {
      mounted = false;
    };
  }, [checkSession, setSession, dispatch]);

  const signOut = useCallback(async () => {
    if (session.status !== "authenticated") return;
    setSession(dispatch, { user: session.user, status: "loading" });

    try {
      const success = await window.electron.ipcRenderer.logout();
      if (success) {
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
