import { BrowserWindow, nativeImage, screen, globalShortcut } from "electron";

// Config
import {
  ROUTE_MIN_HEIGHT,
  ROUTE_MIN_WIDTH,
  ROUTE_HEIGHT,
  ROUTE_WIDTH,
} from "@Config/constants";
import { appSettings } from "../ipc/handler";

// Assets
const iconPath =
  process.platform !== "darwin"
    ? "assets/icons/icon.ico"
    : "assets/icons/icon.icns";

// Utils
import scaleValue from "../utils/scaleValue";
import translateToAccelerator from "../utils/translateToAccelerator";

// Windows
import { mainWindow } from "./mainWindow";

// Save
import Store from "electron-store";
const store = new Store<{
  overlayBounds: { x: number; y: number; width: number; height: number };
}>();

export let overlayWindow: BrowserWindow | null = null;
export function createOverlayWindow(url: string) {
  const {
    alwaysOnTop,
    saveSize,
    savePosition,
    opacity,
    borderless,
    compensateScaling,
  } = appSettings.routeWindow;
  const overlayBounds = store.get("overlayBounds");
  const sf = compensateScaling
    ? overlayBounds
      ? screen.getDisplayMatching(overlayBounds).scaleFactor
      : screen.getPrimaryDisplay().scaleFactor
    : 1;
  const minWidth = Math.round(ROUTE_MIN_WIDTH / sf);
  const minHeight = Math.round(ROUTE_MIN_HEIGHT / sf);

  if (overlayWindow) {
    overlayWindow.close();
  }
  overlayWindow = new BrowserWindow({
    minHeight: minHeight,
    minWidth: minWidth,
    height:
      saveSize && overlayBounds?.height
        ? overlayBounds.height
        : Math.round(ROUTE_HEIGHT / sf),
    width:
      saveSize && overlayBounds?.width
        ? overlayBounds.width
        : Math.round(ROUTE_WIDTH / sf),
    x: savePosition && overlayBounds ? overlayBounds.x : undefined,
    y: savePosition && overlayBounds ? overlayBounds.y : undefined,
    backgroundColor: "#000",
    icon: nativeImage.createFromPath(iconPath),
    title: "Qiqi's Notebook",
    opacity: opacity ?? 1,
    minimizable: false,
    titleBarStyle: borderless ? "hidden" : "default",
    webPreferences: {
      zoomFactor: scaleValue(sf),
    },
  });
  overlayWindow.loadURL(url);

  // Other window setup
  overlayWindow.setFullScreenable(false);
  overlayWindow.removeMenu();
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true }); // Mac
  if (alwaysOnTop) {
    overlayWindow.setAlwaysOnTop(true, "screen-saver");
  }
  overlayWindow.moveTop();

  // BUG: Borderless mode does not respect initialization parameters, requires the following to reset the window properties
  // Load window properties from save
  if (saveSize && overlayBounds) {
    const { width, height } = overlayBounds;
    const newWidth = Math.max(Math.round(ROUTE_MIN_WIDTH / sf), width);
    const newHeight = Math.max(Math.round(ROUTE_MIN_HEIGHT / sf), height);
    overlayWindow.setSize(newWidth, newHeight);
  } else {
    const newWidth = Math.max(minWidth, Math.round(ROUTE_WIDTH / sf));
    const newHeight = Math.max(minHeight, Math.round(ROUTE_HEIGHT / sf));
    overlayWindow.setSize(newWidth, newHeight);
  }

  // Set window properties
  overlayWindow.on("ready-to-show", () => {
    overlayWindow.setMinimumSize(minWidth, minHeight);
    overlayWindow.webContents.setZoomFactor(scaleValue(sf));

    // BUG: Borderless mode does not respect initialization parameters, requires the following to reset the window properties
    // Load window properties from save
    if (saveSize && overlayBounds) {
      const { width, height } = overlayBounds;
      const newWidth = Math.max(Math.round(ROUTE_MIN_WIDTH / sf), width);
      const newHeight = Math.max(Math.round(ROUTE_MIN_HEIGHT / sf), height);
      overlayWindow.setSize(newWidth, newHeight);
    } else {
      overlayWindow.setSize(
        Math.round(ROUTE_WIDTH / sf),
        Math.round(ROUTE_HEIGHT / sf)
      );
    }
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

  // Update window size and scale after moving it
  overlayWindow.on("moved", () => {
    if (!compensateScaling) {
      return;
    }
    const newSf = screen.getDisplayMatching(
      overlayWindow.getBounds()
    ).scaleFactor;
    const newMinWidth = Math.round(ROUTE_MIN_WIDTH / newSf);
    const newMinHeight = Math.round(ROUTE_MIN_HEIGHT / newSf);

    const [currentWidth, currentHeight] = overlayWindow.getSize();
    const newWidth = Math.max(newMinWidth, currentWidth);
    const newHeight = Math.max(newMinHeight, currentHeight);

    overlayWindow.setMinimumSize(newMinWidth, newMinHeight);
    overlayWindow.setSize(newWidth, newHeight);
    overlayWindow.webContents.setZoomFactor(scaleValue(newSf));
  });

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
}

export function launchWindow(url: string) {
  if (overlayWindow) {
    overlayWindow.loadURL(url);
  } else {
    createOverlayWindow(url);
  }
  if (mainWindow && appSettings?.mainWindow.minimize) {
    mainWindow.minimize();
  }
}

export function closeWindow() {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
  }
}
