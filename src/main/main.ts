import { app } from "electron";

// Utils
import { updateElectronApp } from "update-electron-app";

// Windows
import { createMainWindow } from "./windows/mainWindow";

// Events
import { setupAppEvents } from "./events/appEvents";

// Handler
import { initializeIPCHandlers } from "./ipc/handler";

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", createMainWindow);
