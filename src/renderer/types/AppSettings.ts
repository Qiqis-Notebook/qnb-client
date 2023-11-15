export interface AppSettings {
  mainWindow: {
    minimize: boolean;
    save: boolean;
  };
  routeWindow: {
    autoStart: boolean;
    save: boolean;
    opacity: number;
  };
  keybinds: {
    prev: string;
    next: string;
    prevTp: string;
    nextTp: string;
  };
}
