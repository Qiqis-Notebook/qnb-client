import type { KeyBinds } from "@Types/AppSettings";

/**
 * Checks if a keybind already exists
 * @param keybind keybind to check
 * @param keybinds keybinds to check with
 * @returns true if there is an existing keybind, false otherwise
 */
export default function isDuplicateKeybind(
  keybind: KeyBinds,
  keybinds: KeyBinds[]
) {
  for (const key of keybinds) {
    if (
      key.alt === keybind.alt &&
      key.ctrl === keybind.ctrl &&
      key.shift === keybind.shift &&
      key.key === keybind.key
    ) {
      return true; // exit and return true once a match is found
    }
  }
  return false; // return false if no match is found
}
