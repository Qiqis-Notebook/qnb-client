/**
 * A translation layer for Web keyboard event to ElectronJS accelerator
 *
 * ElectronJS docs: https://www.electronjs.org/docs/latest/api/accelerator
 * @param event Keyboard Event
 * @returns An object with the original key code or the key for special keys and the ElectronJS accelerator
 */
export default function translateKey(event: KeyboardEvent): {
  code?: string;
  key?: string;
  accelerator: string;
} | null {
  const code = event.code;

  // Keys
  // 0 to 9
  if (code.match(/^Digit[0-9]$/)) {
    return { code, accelerator: code[5] };
  }

  // A to Z
  if (code.match(/^Key[A-Z]$/)) {
    return { code, accelerator: code[3] };
  }

  // F1 to F24
  if (code.match(/^(F2[0-4]|F1*[1-9]|F10)$/)) {
    return { code, accelerator: code };
  }

  // Plus

  // Space
  if (code === "Space") {
    return { code, accelerator: code };
  }

  // Tab
  if (code === "Tab") {
    return { code, accelerator: code };
  }

  // Capslock
  if (code === "CapsLock") {
    return { code, accelerator: "Capslock" };
  }

  // Numlock
  if (code === "NumLock") {
    return { code, accelerator: "Numlock" };
  }

  // Scrolllock
  if (code === "ScrollLock") {
    return { code, accelerator: "Scrolllock" };
  }

  // Backspace
  if (code === "Backspace") {
    return { code, accelerator: "Backspace" };
  }

  // Delete
  if (code === "Delete") {
    return { code, accelerator: "Delete" };
  }

  // Insert
  if (code === "Insert") {
    return { code, accelerator: "Insert" };
  }

  // Return (or Enter as alias)
  if (code === "Return" || code === "Enter") {
    return { code, accelerator: "Enter" };
  }

  // Up, Down, Left and Right
  if (code.match(/^Arrow(.+)$/)) {
    return { code, accelerator: code.substring(5) };
  }

  // Home and End
  if (code === "Home" || code === "End") {
    return { code, accelerator: code };
  }

  // PageUp and PageDown
  if (code === "PageUp" || code === "PageDown") {
    return { code, accelerator: code };
  }

  // Escape (or Esc for short)
  // Disabled for exiting keybind capture
  // if (code === "Escape") {
  //   return { code, accelerator: code };
  // }

  // VolumeUp, VolumeDown and VolumeMute

  // MediaNextTrack, MediaPreviousTrack, MediaStop and MediaPlayPause

  // PrintScreen

  // Numpad
  // num0 - num9
  if (code.match(/Numpad[0-9]/)) {
    return { code, accelerator: `num${code[6]}` };
  }

  // numdec - decimal key
  if (code === "NumpadDecimal") {
    return { code, accelerator: "numdec" };
  }

  // numadd - numpad + key
  if (code === "NumpadAdd") {
    return { code, accelerator: "numadd" };
  }

  // numsub - numpad - key
  if (code === "NumpadSubtract") {
    return { code, accelerator: "numsub" };
  }

  // nummult - numpad * key
  if (code === "NumpadMultiply") {
    return { code, accelerator: "nummult" };
  }

  // numdiv - numpad ÷ key
  if (code === "NumpadDivide") {
    return { code, accelerator: "numdiv" };
  }

  // Special Key
  // )!@#$%^&*(:;:+=<,_->.?/~`{][|\}"'
  if (
    !event.shiftKey &&
    event.key.match(/^[)!@#$%^&*(:+<_>?~{|}";=,\-./`[\\\]']$/)
  ) {
    return { key: event.key, accelerator: event.key };
  }

  // No match
  return null;
}
