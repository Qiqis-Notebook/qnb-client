import { app, BrowserWindow, ipcMain, shell } from "electron";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";

// Constants
const isDev = process.env.NODE_ENV === "development";

const DEV_URL = "http://127.0.0.1:3001";
const PROD_URL = "https://www.qiqis-notebook.com";
const API_URL = isDev ? DEV_URL + "/api" : PROD_URL + "/api";

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

ipcMain.on("ipc-bridge", async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply("ipc-bridge", msgTemplate("pong"));
});

// Fetch data from any URL and send it to the renderer process
ipcMain.on("get-data", async (event, { url, requestId }) => {
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
    event.reply("data-reply", { requestId, data: response.data });
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("Error fetching data:", error.message);
      event.reply("data-reply", { requestId, error: error.message });
    }
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

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });
};

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
