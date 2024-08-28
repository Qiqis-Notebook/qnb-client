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

// Authentication
import {
  checkSession,
  getToken,
  getUser,
  logout,
} from "../utils/authentication";

// Cache
import { Cache } from "../lib/Cache";
const cache = new Cache();

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
        options,
      }: {
        url: string;
        requestId: string;
        options?: {
          ttl?: number;
          tags?: string[];
          method?: "GET" | "POST" | "DELETE";
          credentials?: boolean;
        };
      }
    ) => {
      try {
        // URL
        const urlObj = new URL(`${API_URL}${url}`);

        // Options
        const ttl = options?.ttl ?? 3600;
        const tags = options?.tags;
        const method = options?.method ?? "GET";
        const credentials = options?.credentials ?? false;

        // Credentials
        let token = credentials ? getToken() : null;
        if (credentials) {
          if (!token) return { requestId, error: "No credentials" };
          urlObj.searchParams.set("token", token);
        }

        // Hash the request string
        const urlHash = createHashString(url);

        // Check cache
        const data = ttl ? cache.get(urlHash) : null;
        if (data) {
          return { requestId, data };
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

        // POST
        if (method === "POST") {
          const response = await axios.post(urlObj.toString(), config);
          return { requestId, data: response.data };
        }

        // DELETE
        if (method === "DELETE") {
          const response = await axios.delete(urlObj.toString(), config);
          return { requestId, data: response.data };
        }

        // GET
        const response = await axios.get(urlObj.toString(), config);

        // Save to cache
        if (ttl && response.status === 200) {
          cache.set(urlHash, response.data, { ttl, tags: tags });
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

  ipcMain.on(
    "invalidate",
    async (event, { url, tags }: { url?: string; tags?: string[] }) => {
      if (url) {
        // Hash the request string
        const urlHash = createHashString(url);
        cache.invalidateByUrlHash(urlHash);
      }
      if (tags) {
        cache.invalidateByTag(tags);
      }
    }
  );

  ipcMain.on("open-window", async (event, url) => {
    launchWindow(url);
  });

  ipcMain.on("close-window", async () => {
    closeWindow();
  });

  ipcMain.handle("session", async () => {
    const user = getUser();
    if (user) return user;
    return await checkSession();
  });

  ipcMain.handle("logout", async () => {
    const user = getUser();
    if (!user) return false;
    return await logout();
  });
}
