// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import type { AppSettings } from "@Types/AppSettings";
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

export type Channels = "data-reply" | "window-event";

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
      ttl?: number // Cache TTL (seconds)
    ): Promise<{ requestId: string; data?: T; error?: string }> {
      return ipcRenderer.invoke("get-data", { url, requestId, ttl });
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
  },
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
