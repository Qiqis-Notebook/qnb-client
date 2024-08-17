import { ipcMain } from "electron";
import axios from "axios";
const cancelToken = axios.CancelToken;

// Types
import type { AppSettings } from "@Types/AppSettings";
import type { AxiosRequestConfig, CancelTokenSource } from "axios";

// Constants
import { API_URL } from "@Config/constants";

// Windows
import { launchWindow, closeWindow } from "../windows/overlayWindow";

// Cache
import NodeCache from "node-cache";
const fetchCache = new NodeCache({ checkperiod: 600 });

// Utils
import { createHashString } from "../utils/createHashString";

// Pending request cancel tokens
const requestCancelTokens: Map<string, CancelTokenSource> = new Map();

export let appSettings: AppSettings | null = null;
ipcMain.on("settings", async (event, settings: AppSettings) => {
  appSettings = settings;
});

export function initializeIPCHandlers() {
  ipcMain.handle(
    "get-data",
    async (
      event,
      {
        url,
        requestId,
        ttl = 3600,
      }: { url: string; requestId: string; ttl?: number }
    ) => {
      try {
        // Hash the request string
        const urlHash = createHashString(url);

        // Check cache
        const cache = ttl ? fetchCache.get(urlHash) : null;
        if (cache) {
          return { requestId, data: cache };
        }

        // Cancel any existing request with the same ID before making a new one
        const existingCancelToken = requestCancelTokens.get(requestId);
        if (existingCancelToken) {
          existingCancelToken.cancel("Request canceled due to new request");
        }

        // Create a new cancellation token source
        const cancelTokenSource = cancelToken.source();
        requestCancelTokens.set(requestId, cancelTokenSource);

        const config: AxiosRequestConfig = {
          cancelToken: cancelTokenSource.token,
          adapter: "http",
        };

        const response = await axios.get(`${API_URL}${url}`, config);

        // Save to cache
        if (ttl && response.status === 200) {
          fetchCache.set(urlHash, response.data, ttl);
        }

        return { requestId, data: response.data };
      } catch (error) {
        console.error(error.message);
        return { requestId, error: error.message };
      } finally {
        // Remove the cancel token source after the request is completed
        requestCancelTokens.delete(requestId);
      }
    }
  );

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

  ipcMain.on("close-window", async () => {
    closeWindow();
  });
}
