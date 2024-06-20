export interface KeyBinds {
  enable: boolean;
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  key: string;
}
export interface AppSettings {
  mainWindow: {
    minimize: boolean;
    reducedColor: boolean;
  };
  routeWindow: {
    alwaysOnTop: boolean;
    autoStart: boolean;
    opacity: number;
    borderless: boolean;
    savePosition: boolean;
    saveSize: boolean;
    compensateScaling: boolean;
  };
  keybinds: {
    prev: KeyBinds;
    next: KeyBinds;
    prevTp: KeyBinds;
    nextTp: KeyBinds;
  };
}
