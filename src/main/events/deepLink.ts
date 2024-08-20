// Config
import { CUSTOM_PROTOCOL } from "@Config/constants";

// Authentication
import { checkSession, getUser } from "../utils/authentication";

// Windows
import { mainWindow } from "../windows/mainWindow";

export default function handleDeepLinks(url: string) {
  const urlObj = new URL(url);
  const { hostname, protocol } = urlObj;

  // Check custom protocol
  if (protocol !== `${CUSTOM_PROTOCOL}:`) return;

  switch (hostname) {
    case "auth-callback":
      handleAuthCallback(url);
      break;
    case "route-redirect":
      handleRouteCallback(url);
      break;
    default:
      console.error("No matching deep link handler");
      break;
  }
}

async function handleAuthCallback(url: string) {
  // Already authenticated
  if (getUser()) {
    return;
  }

  const urlObj = new URL(url);
  const token = urlObj.searchParams.get("token");
  if (urlObj.pathname === "/success" && token) {
    // Check token
    const user = await checkSession(token);
    if (mainWindow) {
      mainWindow.webContents.send("auth", user);
    }
  }
}

async function handleRouteCallback(url: string) {
  const urlObj = new URL(url);
  const id = urlObj.searchParams.get("id");
  if (urlObj.pathname === "/route" && id) {
    // Check id format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return;
    }
    // Launch route
    if (mainWindow) {
      mainWindow.webContents.send("route", id);
    }
  }
}
