// Types
import { KeyBinds } from "@Types/AppSettings";

/**
 * Checks that a keybind is valid
 * @param keybind Keybind to check
 * @returns Error message or null if no error
 */
export default function checkKeybindError(keybind: KeyBinds) {
  if (!keybind.alt && !keybind.ctrl && !keybind.shift) {
    return "At least 1 modifier key required";
  }
  if (!keybind.key) {
    return "Missing key";
  }
  return null;
}
