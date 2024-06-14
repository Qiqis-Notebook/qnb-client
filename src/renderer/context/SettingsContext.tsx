import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

// Types
import type { AppSettings } from "@Types/AppSettings";

// Utils
import { syncSettings } from "@Utils/syncSetting";

interface SettingsContextProps {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const defaultSettings: AppSettings = {
  mainWindow: { minimize: true, reducedColor: false },
  routeWindow: {
    autoStart: false,
    opacity: 1,
    borderless: false,
    savePosition: true,
    saveSize: true,
    compensateScaling: false,
  },
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
      return defaultSettings;
    } else {
      const savedSettings = JSON.parse(storedSettings);

      // Syncronise settings if there are new values
      const updatedSettings = syncSettings(savedSettings, defaultSettings);

      localStorage.setItem("appSettings", JSON.stringify(updatedSettings));
      return updatedSettings;
    }
  });

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
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
