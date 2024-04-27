interface KeyBinds {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  key: string;
}

/**
 * Checks that a keybind is valid
 * @param keybind Keybind to check
 * @returns Error message or null if no error
 */
export default function translateToAccelerator(
  keybind: KeyBinds
): string | null {
  if (!keybind.alt && !keybind.ctrl && !keybind.shift) {
    return null;
  }
  if (!keybind.key) {
    return null;
  }

  let keys = [];
  if (keybind.ctrl) {
    keys.push("CommandOrControl");
  }
  if (keybind.shift) {
    keys.push("Shift");
  }
  if (keybind.alt) {
    keys.push("Alt");
  }
  keys.push(keybind.key);

  const accelerator = keys.join("+");
  return accelerator;
}
