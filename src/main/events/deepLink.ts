// Config
import { CUSTOM_PROTOCOL } from "@Config/constants";

// Authentication
import { checkSession } from "../utils/authentication";

// Windows
import { mainWindow } from "../windows/mainWindow";

export default function handleDeepLinks(url: string) {
  const urlObj = new URL(url);
  const { hostname, pathname, searchParams } = urlObj;
  if (isAuthCallbackUrl(url)) {
    handleAuthCallback(url);
  } else {
    // switch (urlObj.hostname) {
    //   case "value":
    //     break;
    //   default:
    //     break;
    // }
  }
}

function isAuthCallbackUrl(url: string): boolean {
  const urlObj = new URL(url);
  // Check if the protocol and path match the expected format
  return (
    urlObj.protocol === `${CUSTOM_PROTOCOL}:` &&
    urlObj.hostname === "auth-callback"
  );
}

async function handleAuthCallback(url: string) {
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
