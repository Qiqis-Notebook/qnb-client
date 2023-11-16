export interface KeyBinds {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  key: string;
}
export interface AppSettings {
  mainWindow: {
    minimize: boolean;
    save: boolean;
    reducedColor: boolean;
  };
  routeWindow: {
    autoStart: boolean;
    save: boolean;
    opacity: number;
  };
  keybinds: {
    prev: KeyBinds;
    next: KeyBinds;
    prevTp: KeyBinds;
    nextTp: KeyBinds;
  };
}
