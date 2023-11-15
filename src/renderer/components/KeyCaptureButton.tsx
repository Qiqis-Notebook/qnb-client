import { useState, useEffect, useRef, useMemo } from "react";

// Utils
import translateKey from "@Utils/translateKey";
import isAccelerator from "electron-is-accelerator";
import { toast } from "react-toastify";

// Type
interface Keys {
  code: string;
  accelerator: string;
  modifier: boolean;
}

export default function KeyCaptureButton({
  value,
  onKeyCaptured,
}: {
  value: string;
  onKeyCaptured(captured: string): void;
}) {
  const [capturing, setCapturing] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Keys[]>([]);
  const keysPressedRef = useRef<Keys[]>();
  keysPressedRef.current = keysPressed;

  const accelerator = useMemo(
    () => keysPressed.map((item) => item.accelerator).join("+"),
    [keysPressed]
  );
  const acceleratorRef = useRef<string>();
  acceleratorRef.current = accelerator;

  useEffect(() => {
    if (!capturing) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Exit capture
      if (event.code === "Escape") {
        // Clear the keys array
        setKeysPressed([]);

        // Stop capture
        setCapturing(false);
      }

      const translated = translateKey(event);
      if (!translated) return;

      if (
        !keysPressedRef.current.find((item) => item.code === translated.code)
      ) {
        // console.table(translated);
        // console.log(event.code, translateKey(event));
        setKeysPressed((prevKeys) => [...prevKeys, translated]);
      }
    };

    const handleKeyUp = () => {
      // Clear the keys array
      setKeysPressed([]);

      // Stop capture
      setCapturing(false);

      // Return if valid
      const modifierCount = keysPressedRef.current.filter(
        (item) => item.modifier === true
      ).length;
      const keyCount = keysPressedRef.current.filter(
        (item) => item.modifier === false
      ).length;
      if (
        modifierCount >= 1 &&
        keyCount === 1 &&
        isAccelerator(acceleratorRef.current)
      ) {
        onKeyCaptured(acceleratorRef.current);
      } else {
        toast.error("Invalid key combination");
      }
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
    <button
      className="btn w-64"
      onClick={() => setCapturing(true)}
      disabled={capturing}
    >
      {capturing
        ? keysPressed.length > 0
          ? accelerator
          : "Esc to Cancel"
        : value || "Set keybinds"}
    </button>
  );
}
