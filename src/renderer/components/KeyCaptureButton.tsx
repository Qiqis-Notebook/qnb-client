import { useState, useEffect, useRef } from "react";

// Types
import type { KeyBinds } from "@Types/AppSettings";

// Utils
import translateKey from "@Utils/translateKey";

// Type
interface Key {
  code?: string;
  key?: string;
  accelerator: string;
}

export default function KeyCaptureButton({
  value,
  onKeyCaptured,
}: {
  value: KeyBinds;
  onKeyCaptured(captured: KeyBinds): void;
}) {
  const [capturing, setCapturing] = useState(false);
  const [keyPressed, setKeyPressed] = useState<Key | null>(null);
  const keyPressedRef = useRef<Key>();
  keyPressedRef.current = keyPressed;

  const { ctrl, shift, alt, key, enable } = value;
  const valueRef = useRef<KeyBinds>();
  valueRef.current = value;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Exit capture
      if (event.code === "Escape") {
        // Clear the key
        setKeyPressed(null);

        // Stop capture
        setCapturing(false);
      }

      const translated = translateKey(event);
      if (!translated) return;
      setKeyPressed(translated);
    };

    const handleKeyUp = () => {
      if (!keyPressedRef.current) return;

      onKeyCaptured({
        ...valueRef.current,
        key: keyPressedRef.current.accelerator,
      });

      // Stop capture
      setCapturing(false);
    };

    if (!capturing) return;
    if (!enable) {
      setCapturing(false);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      return;
    }

    // Add event listeners when the component mounts
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Clean up the event listeners when the component unmounts
    return () => {
      if (capturing) {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, [capturing, enable]);

  return (
    <div
      className={`flex gap-1 p-2 rounded-md items-center ${
        !ctrl && !shift && !alt && key === "" && enable && "bg-red-500/50"
      }`}
    >
      <input
        type="checkbox"
        className="toggle"
        title={value.enable ? "Disable" : "Enable"}
        checked={value.enable}
        onChange={(e) => {
          if (e.target.checked) {
            onKeyCaptured({ ...value, enable: e.target.checked });
          } else {
            // Clear keybinds if disable
            onKeyCaptured({
              shift: false,
              ctrl: false,
              alt: false,
              key: "",
              enable: e.target.checked,
            });
          }
        }}
      />
      <button
        disabled={!value.enable}
        className={`btn btn-sm ${ctrl ? "btn-primary" : "btn-ghost"} w-24`}
        onClick={() => onKeyCaptured({ ...value, ctrl: !ctrl })}
      >
        Ctrl
      </button>
      <button
        disabled={!value.enable}
        className={`btn btn-sm ${shift ? "btn-primary" : "btn-ghost"} w-24`}
        onClick={() => onKeyCaptured({ ...value, shift: !shift })}
      >
        Shift
      </button>
      <button
        disabled={!value.enable}
        className={`btn btn-sm ${alt ? "btn-primary" : "btn-ghost"} w-24`}
        onClick={() => onKeyCaptured({ ...value, alt: !alt })}
      >
        Alt
      </button>
      <button
        className="btn btn-sm w-48"
        onClick={() => setCapturing(true)}
        disabled={capturing || !value.enable}
      >
        {capturing ? "Set key/Esc to cancel" : value.key || "Set keybind"}
      </button>
    </div>
  );
}
