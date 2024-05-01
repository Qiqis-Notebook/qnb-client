import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  nativeImage,
  shell,
  screen,
} from "electron";

// Utils
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import Store from "electron-store";
import translateToAccelerator from "./utils/translateToAccelerator";

// Constants
import { isDev, API_URL } from "@Config/constants";

// Types
import { AppSettings } from "@Types/AppSettings";

const iconPath =
  process.platform !== "darwin"
    ? "assets/icons/icon.ico"
    : "assets/icons/icon.icns";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const requestCancelTokens: Map<string, CancelTokenSource> = new Map();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// App updater
import { updateElectronApp } from "update-electron-app";
updateElectronApp();

// Fetch data from any URL and send it to the renderer process
ipcMain.handle("get-data", async (event, { url, requestId }) => {
  try {
    // Cancel any existing request with the same ID before making a new one
    const existingCancelToken = requestCancelTokens.get(requestId);
    if (existingCancelToken) {
      existingCancelToken.cancel("Request canceled due to new request");
    }

    // Create a new cancellation token source
    const cancelTokenSource = axios.CancelToken.source();
    requestCancelTokens.set(requestId, cancelTokenSource);

    const config: AxiosRequestConfig = {
      cancelToken: cancelTokenSource.token,
      adapter: "http",
    };

    const response = await axios.get(`${API_URL}${url}`, config);
    return { requestId, data: response.data };
  } catch (error) {
    console.error(error.message);
    return { requestId, error: error.message };
  } finally {
    // Remove the cancel token source after the request is completed
    requestCancelTokens.delete(requestId);
  }
});

ipcMain.on("abort-request", (event, requestId) => {
  // Cancel the specific request with the provided ID
  const cancelTokenSource = requestCancelTokens.get(requestId);
  if (cancelTokenSource) {
    cancelTokenSource.cancel("Request canceled by user");
    requestCancelTokens.delete(requestId);
  }
});

ipcMain.on("open-window", async (event, url) => {
  launchWindow(url);
});

ipcMain.on("close-window", async (event) => {
  closeWindow();
});

let appSettings: AppSettings | null = null;
ipcMain.on("settings", async (event, settings: AppSettings) => {
  appSettings = settings;
});

// App setting file
interface StoreSchema {
  overlayBounds: { x: number; y: number; width: number; height: number };
}
const store = new Store<StoreSchema>();

// Windows
let mainWindow: BrowserWindow;
let overlayWindow: BrowserWindow;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minHeight: 733,
    minWidth: 1016,
    height: 733,
    width: 1216,
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      backgroundThrottling: false, // Prevent timer suspension
    },
    title: "Qiqi's Notebook",
    backgroundColor: "#191919",
    show: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Other window setup
  mainWindow.removeMenu();

  // Close overlay window on close
  mainWindow.on("close", () => {
    if (overlayWindow) {
      overlayWindow.close();
    }
  });

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  // Show once ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
};

function createOverlayWindow(url: string) {
  const overlayBounds = store.get("overlayBounds");

  /**
   * Scale factor
   * Workaround for window size from save when the screen pixel scaling is not 1
   * Non-borderless window will work too (somehow)
   *
   * BUG: Setting size for screens with pixel scaling will not work properly
   * When setting the window size, electron will apply scale factor automatically to the size.
   * Scale the size to accomodate for minimum sized window.
   */
  const sf = overlayBounds
    ? screen.getDisplayMatching(overlayBounds).scaleFactor
    : 1;

  if (overlayWindow) {
    overlayWindow.close();
  }
  overlayWindow = new BrowserWindow({
    minHeight: Math.round(375 / sf),
    minWidth: Math.round(400 / sf),
    height: Math.round(375 / sf),
    width: Math.round(400 / sf),
    x:
      appSettings.routeWindow.savePosition && overlayBounds
        ? overlayBounds.x
        : undefined,
    y:
      appSettings.routeWindow.savePosition && overlayBounds
        ? overlayBounds.y
        : undefined,
    backgroundColor: "#000",
    icon: nativeImage.createFromPath(iconPath),
    title: "Qiqi's Notebook",
    opacity: appSettings?.routeWindow.opacity ?? 1,
    minimizable: false,
    titleBarStyle: appSettings?.routeWindow.borderless ? "hidden" : "default",
  });
  overlayWindow.loadURL(url);

  // Other window setup
  overlayWindow.setFullScreenable(false);
  overlayWindow.removeMenu();
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true }); // Mac
  overlayWindow.setAlwaysOnTop(true, "screen-saver");
  overlayWindow.moveTop();

  if (appSettings.routeWindow.saveSize && overlayBounds) {
    overlayWindow.setSize(overlayBounds.width, overlayBounds.height);
  }

  // Global shortcut
  const keybinds = appSettings?.keybinds;
  if (keybinds) {
    // Prev
    if (keybinds.prev.enable) {
      const prevAccelerator = translateToAccelerator(keybinds.prev);
      if (prevAccelerator) {
        globalShortcut.register(prevAccelerator, () => {
          console.log("Prev"); // BUG: Somehow improves the execution time of this function, likely due to timing, event loop or other factors, needs more investigation
          overlayWindow.webContents.executeJavaScript(
            `document.getElementById("route-prev").click()`
          );
        });
      }
    }

    // Next
    if (keybinds.next.enable) {
      const nextAccelerator = translateToAccelerator(keybinds.next);
      if (nextAccelerator) {
        globalShortcut.register(nextAccelerator, () => {
          console.log("Next"); // BUG: Somehow improves the execution time of this function, likely due to timing, event loop or other factors, needs more investigation
          overlayWindow.webContents.executeJavaScript(
            `document.getElementById("route-next").click()`
          );
        });
      }
    }

    // Prev TP
    if (keybinds.prevTp.enable) {
      const prevTpAccelerator = translateToAccelerator(keybinds.prevTp);
      if (prevTpAccelerator) {
        globalShortcut.register(prevTpAccelerator, () => {
          console.log("Prev TP"); // BUG: Somehow improves the execution time of this function, likely due to timing, event loop or other factors, needs more investigation
          overlayWindow.webContents.executeJavaScript(
            `document.getElementById("route-prev-tp").click()`
          );
        });
      }
    }

    // Next TP
    if (keybinds.nextTp.enable) {
      const nextTpAccelerator = translateToAccelerator(keybinds.nextTp);
      if (nextTpAccelerator) {
        globalShortcut.register(nextTpAccelerator, () => {
          console.log("Next TP"); // BUG: Somehow improves the execution time of this function, likely due to timing, event loop or other factors, needs more investigation
          overlayWindow.webContents.executeJavaScript(
            `document.getElementById("route-next-tp").click()`
          );
        });
      }
    }
  }

  // Reset minimum window size if there's a saved window size
  overlayWindow.on("ready-to-show", () => {
    if (!overlayBounds) return;
    overlayWindow.setMinimumSize(400, 375);
  });

  // Clean up on close
  overlayWindow.on("close", () => {
    // Save window position/size
    if (overlayWindow) {
      store.set("overlayBounds", overlayWindow.getBounds());
    }

    overlayWindow = null;
    globalShortcut.unregisterAll();
    if (mainWindow) {
      mainWindow.webContents.send("window-event", 0);
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function launchWindow(url: string) {
  if (overlayWindow) {
    overlayWindow.loadURL(url);
  } else {
    createOverlayWindow(url);
  }
  if (mainWindow && appSettings?.mainWindow.minimize) {
    mainWindow.minimize();
  }
}

function closeWindow() {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
  }
}
