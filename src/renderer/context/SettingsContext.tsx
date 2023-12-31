import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { AppSettings } from "@Types/AppSettings";

interface SettingsContextProps {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const defaultSettings = {
  mainWindow: { minimize: true, reducedColor: false },
  routeWindow: { autoStart: false, opacity: 1 },
  keybinds: {
    prev: { enable: true, shift: false, ctrl: false, alt: true, key: "Left" },
    next: { enable: true, shift: false, ctrl: false, alt: true, key: "Right" },
    prevTp: {
      enable: false,
      shift: false,
      ctrl: false,
      alt: false,
      key: "",
    },
    nextTp: {
      enable: false,
      shift: false,
      ctrl: false,
      alt: false,
      key: "",
    },
  },
};

function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load settings from local storage or use default values
    const storedSettings = localStorage.getItem("appSettings");
    if (!storedSettings) {
      localStorage.setItem("appSettings", JSON.stringify(defaultSettings));
    }
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  });

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
    // TODO: Send to main process
  };

  useEffect(() => {
    window.electron.ipcRenderer.updateSetting(settings);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export { SettingsProvider, useSettings };
