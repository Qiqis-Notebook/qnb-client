import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */

// Types
import type { AppSettings } from "@Types/AppSettings";
import type { AuthUser } from "./utils/authentication";

export type Channels = "window-event" | "auth" | "route";

const electronHandler = {
  ipcRenderer: {
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    getData<T>(
      url: string,
      requestId: string,
      options?: {
        ttl?: number; // Cache TTL (seconds)
        tags?: string[]; // Cache tag
        method?: "GET" | "POST" | "DELETE";
        credentials?: boolean;
      }
    ): Promise<{ requestId: string; data?: T; error?: string }> {
      return ipcRenderer.invoke("get-data", { url, requestId, options });
    },
    invalidate({ url, tags }: { url?: string; tags?: string[] }) {
      ipcRenderer.send("invalidate", { url, tags });
    },
    abortRequest(requestId: string) {
      ipcRenderer.send("abort-request", requestId);
    },
    openWindow(url: string) {
      ipcRenderer.send("open-window", url);
    },
    closeWindow() {
      ipcRenderer.send("close-window");
    },
    updateSetting(settings: AppSettings) {
      ipcRenderer.send("settings", settings);
    },
    session(): Promise<AuthUser | null> {
      return ipcRenderer.invoke("session");
    },
    logout(): Promise<boolean> {
      return ipcRenderer.invoke("logout");
    },
  },
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
