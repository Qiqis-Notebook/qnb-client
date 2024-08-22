import { app } from "electron";
import path from "node:path";

// Config
import { CUSTOM_PROTOCOL } from "@Config/constants";

// Utils
import { updateElectronApp } from "update-electron-app";

// Windows
import { createMainWindow, mainWindow } from "./windows/mainWindow";

// Events
import { setupAppEvents } from "./events/appEvents";

// Handler
import { initializeIPCHandlers } from "./ipc/handler";
import handleDeepLinks from "./events/deepLink";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Update Electron App
updateElectronApp();

// Initialize IPC handlers
initializeIPCHandlers();

// Setup application events
setupAppEvents();

// Custom protocol
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL);
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    // the commandLine is array of strings in which last element is deep link url
    handleDeepLinks(commandLine.pop());
  });

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    createMainWindow();
  });
}
