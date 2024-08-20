import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Components
import { toast } from "react-toastify";

export default function EventHandler() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const launchRoute = useCallback(
    (id: string) => {
      // Replace current if already on route page
      if (pathnameRef.current.startsWith("/route")) {
        navigate(`/route/${id}`, { replace: true });
      } else {
        navigate(`/route/${id}`);
      }
    },
    [pathnameRef]
  );

  useEffect(() => {
    let mounted = true;

    // Listen to route open event
    window.electron.ipcRenderer.on("route", (id: string) => {
      launchRoute(id);
    });

    return () => {
      mounted = false;
    };
  }, [launchRoute]);

  // Connection status
  useEffect(() => {
    const updateOnlineStatus = () => {
      navigator.onLine
        ? toast.success("Connected", { autoClose: false })
        : toast.error("Connection lost", { autoClose: false });
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return <></>;
}
