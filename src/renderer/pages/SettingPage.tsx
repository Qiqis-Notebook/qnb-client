// Context
import { useSettings } from "@Context/SettingsContext";

// Components
import KeyCaptureButton from "@Components/KeyCaptureButton";
import checkKeybindError from "@Utils/checkKeybindError";

// Utils
import { toast } from "react-toastify";
import isDuplicateKeybind from "@Utils/isDuplicateKeybind";

function safeParseFloat(value: string, fallback: number): number {
  try {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? fallback : parsedValue;
  } catch (error) {
    console.error(`Error parsing '${value}' to number: ${error.message}`);
    return fallback; // Default value
  }
}

export default function SettingPage() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="p-2 flex flex-col gap-2 max-h-screen overflow-y-auto w-full">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="w-full flex flex-col gap-8">
        {/* Main Window */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Main Window</h2>
          <div className="divider my-0" />
          {/* Auto minimize */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg">Minimize</h2>
            <div className="flex gap-1 justify-between items-center">
              <p>
                Automatically minimize then main window when route window
                launches.
              </p>
              <input
                type="checkbox"
                className="toggle"
                checked={settings.mainWindow.minimize}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    mainWindow: {
                      ...settings.mainWindow,
                      minimize: e.target.checked,
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="divider h-1 my-0" />
          {/* Reduced color */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg">Reduced color</h2>
            <div className="flex gap-1 justify-between items-center">
              <div>
                <p>Remove accent colors on some components.</p>
                <p>Affects "Featured" route border</p>
              </div>
              <input
                type="checkbox"
                className="toggle"
                checked={settings.mainWindow.reducedColor}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    mainWindow: {
                      ...settings.mainWindow,
                      reducedColor: e.target.checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
        {/* Route Window */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Route Window</h2>
          <div className="divider my-0" />
          {/* Auto-start */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg">Auto-start</h2>
            <div className="flex gap-1 justify-between items-center">
              <p>Launch the route window automatically when route is loaded.</p>
              <input
                type="checkbox"
                className="toggle"
                checked={settings.routeWindow.autoStart}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    routeWindow: {
                      ...settings.routeWindow,
                      autoStart: e.target.checked,
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="divider h-1 my-0" />
          {/* Opacity */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg">Opacity</h2>
            <div className="flex gap-1 justify-between items-center">
              <p>The opacity of the route window.</p>
              <div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.routeWindow.opacity * 100}
                  className="range"
                  step="10"
                  title={`${settings.routeWindow.opacity * 100}%`}
                  onChange={(e) => {
                    if (e.target.value === "0") return; // Faster check without parsing

                    const value = safeParseFloat(e.target.value, 1.0); // Safely parse as float
                    if (value < 10) return;

                    const converted = parseFloat((value / 100).toFixed(1)); // Scale to 0-1 range
                    updateSettings({
                      ...settings,
                      routeWindow: {
                        ...settings.routeWindow,
                        opacity: converted,
                      },
                    });
                  }}
                />
                <div className="w-64 flex justify-between text-xs px-2">
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Keybinds */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Keybinds</h2>
          <div className="divider my-0" />
          <div className="my-2 flex flex-col gap-1">
            Requires 1 or more Modifiers and 1 Key
            <div className="collapse collapse-arrow border border-base-300 bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">Modifier</div>
              <div className="collapse-content">
                <div className="divider my-0" />
                <ul>
                  <li>Ctrl/Cmd</li>
                  <li>Alt</li>
                  <li>Shift</li>
                </ul>
              </div>
            </div>
            <div className="collapse collapse-arrow border border-base-300 bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">Key</div>
              <div className="collapse-content">
                <div className="divider my-0" />
                <ul>
                  <li>A-Z</li>
                  <li>0-9</li>
                  <li>F1-F24</li>
                  <li>Arrow</li>
                  <li>Numpad</li>
                  <li>Space</li>
                  <li>Tab</li>
                  <li>Capslock</li>
                  <li>Numlock</li>
                  <li>Backspace</li>
                  <li>Delete</li>
                  <li>Insert</li>
                  <li>Return/Enter</li>
                  <li>Home</li>
                  <li>End</li>
                  <li>Page Up</li>
                  <li>Page Down</li>
                  <li>{")!@#$%^&*(:;:+=<,_->.?/~`{][|}\"'"}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-lg">Previous Marker</h2>
            <KeyCaptureButton
              value={settings.keybinds.prev}
              onKeyCaptured={(captured) => {
                const error = checkKeybindError(captured);
                if (error) {
                  toast.error(error);
                }

                const check = { ...settings.keybinds };
                delete check.prev; // Skip checking self
                if (isDuplicateKeybind(captured, Object.values(check))) {
                  toast.error("Keybind in use");
                  return;
                }
                updateSettings({
                  ...settings,
                  keybinds: {
                    ...settings.keybinds,
                    prev: captured,
                  },
                });
              }}
            />
          </div>
          <div className="divider h-1 my-0" />
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-lg">Next Marker</h2>
            <KeyCaptureButton
              value={settings.keybinds.next}
              onKeyCaptured={(captured) => {
                const error = checkKeybindError(captured);
                if (error) {
                  toast.error(error);
                }

                const check = { ...settings.keybinds };
                delete check.next; // Skip checking self
                if (isDuplicateKeybind(captured, Object.values(check))) {
                  toast.error("Keybind in use");
                  return;
                }
                updateSettings({
                  ...settings,
                  keybinds: {
                    ...settings.keybinds,
                    next: captured,
                  },
                });
              }}
            />
          </div>
          <div className="divider h-1 my-0" />
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-lg">Previous Teleporter</h2>
            <KeyCaptureButton
              value={settings.keybinds.prevTp}
              onKeyCaptured={(captured) => {
                const error = checkKeybindError(captured);
                if (error) {
                  toast.error(error);
                }

                const check = { ...settings.keybinds };
                delete check.prevTp; // Skip checking self
                if (isDuplicateKeybind(captured, Object.values(check))) {
                  toast.error("Keybind in use");
                  return;
                }
                updateSettings({
                  ...settings,
                  keybinds: {
                    ...settings.keybinds,
                    prevTp: captured,
                  },
                });
              }}
            />
          </div>
          <div className="divider h-1 my-0" />
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-lg">Next Teleporter</h2>
            <KeyCaptureButton
              value={settings.keybinds.nextTp}
              onKeyCaptured={(captured) => {
                const error = checkKeybindError(captured);
                if (error) {
                  toast.error(error);
                }

                const check = { ...settings.keybinds };
                delete check.nextTp; // Skip checking self
                if (isDuplicateKeybind(captured, Object.values(check))) {
                  toast.error("Keybind in use");
                  return;
                }
                updateSettings({
                  ...settings,
                  keybinds: {
                    ...settings.keybinds,
                    nextTp: captured,
                  },
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
