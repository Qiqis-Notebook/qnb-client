import { useState, useEffect, useRef, useMemo } from "react";

// Types
import { KeyBinds } from "@Types/AppSettings";

// Utils
import translateKey from "@Utils/translateKey";
import isAccelerator from "electron-is-accelerator";
import { toast } from "react-toastify";

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

  const { ctrl, shift, alt, key } = value;
  const valueRef = useRef<KeyBinds>();
  valueRef.current = value;

  useEffect(() => {
    if (!capturing) return;

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
      // Return if valid
      if (isAccelerator(keyPressedRef.current.accelerator)) {
        onKeyCaptured({
          ...valueRef.current,
          key: keyPressedRef.current.accelerator,
        });
      } else {
        setKeyPressed(null);
        toast.error("Invalid key");
      }

      // Stop capture
      setCapturing(false);
    };

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
  }, [capturing]);

  return (
    <div
      className={`flex gap-1 p-2 rounded-md ${
        !ctrl && !shift && !alt && "bg-red-500/50"
      }`}
    >
      <button
        className={`btn btn-sm ${ctrl ? "btn-primary" : "btn-ghost"} w-24`}
        onClick={() => onKeyCaptured({ ...value, ctrl: !ctrl })}
      >
        Ctrl
      </button>
      <button
        className={`btn btn-sm ${shift ? "btn-primary" : "btn-ghost"} w-24`}
        onClick={() => onKeyCaptured({ ...value, shift: !shift })}
      >
        Shift
      </button>
      <button
        className={`btn btn-sm ${alt ? "btn-primary" : "btn-ghost"} w-24`}
        onClick={() => onKeyCaptured({ ...value, alt: !alt })}
      >
        Alt
      </button>
      <button
        className="btn btn-sm w-48"
        onClick={() => setCapturing(true)}
        disabled={capturing}
      >
        {capturing ? "Set key/Esc to cancel" : value.key || "Set keybind"}
      </button>
    </div>
  );
}
