import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

  return <></>;
}
