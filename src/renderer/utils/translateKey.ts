export default function translateKey(event: KeyboardEvent): {
  code: string;
  accelerator: string;
  modifier: boolean;
} | null {
  const code = event.code;
  // Modifiers
  if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    return { code, accelerator: "Shift", modifier: true };
  }
  if (event.code === "ControlLeft" || event.code === "ControlRight") {
    return { code, accelerator: "CommandOrControl", modifier: true };
  }
  if (event.code === "AltLeft" || event.code === "AltRight") {
    return { code, accelerator: "Alt", modifier: true };
  }

  // Keys
  // 0 to 9
  if (code.match(/Digit[0-9]/)) {
    return { code, accelerator: code[5], modifier: false };
  }

  // A to Z
  if (code.match(/Key[A-Z]/)) {
    return { code, accelerator: code[3], modifier: false };
  }

  // F1 to F24
  if (code.match(/F[1-24]/)) {
    return { code, accelerator: code, modifier: false };
  }

  // ), !, @, #, $, %, ^, &, *, (, :, ;, :, +, =, <, ,, _, -, >, ., ?, /, ~, `, {, ], [, |, \, }, "

  // Plus

  // Space
  if (code === "Space") {
    return { code, accelerator: code, modifier: false };
  }

  // Tab
  if (code === "Tab") {
    return { code, accelerator: code, modifier: false };
  }

  // Capslock
  if (code === "CapsLock") {
    return { code, accelerator: "Capslock", modifier: false };
  }

  // Numlock
  if (code === "NumLock") {
    return { code, accelerator: "Numlock", modifier: false };
  }

  // Scrolllock
  if (code === "ScrollLock") {
    return { code, accelerator: "Scrolllock", modifier: false };
  }

  // Backspace
  if (code === "Backspace") {
    return { code, accelerator: "Backspace", modifier: false };
  }

  // Delete
  if (code === "Delete") {
    return { code, accelerator: "Delete", modifier: false };
  }

  // Insert
  if (code === "Insert") {
    return { code, accelerator: "Insert", modifier: false };
  }

  // Return (or Enter as alias)
  if (code === "Return" || code === "Enter") {
    return { code, accelerator: "Enter", modifier: false };
  }

  // Up, Down, Left and Right
  if (code.match(/^Arrow(.+)$/)) {
    return { code, accelerator: code.substring(5), modifier: false };
  }

  // Home and End
  if (code === "Home" || code === "End") {
    return { code, accelerator: code, modifier: false };
  }

  // PageUp and PageDown
  if (code === "PageUp" || code === "PageDown") {
    return { code, accelerator: code, modifier: false };
  }

  // Escape (or Esc for short)
  // Disabled for exiting keybind capture
  // if (code === "Escape") {
  //   return { code, accelerator: code, modifier: false };
  // }

  // VolumeUp, VolumeDown and VolumeMute

  // MediaNextTrack, MediaPreviousTrack, MediaStop and MediaPlayPause

  // PrintScreen

  // Numpad
  // num0 - num9
  if (code.match(/Numpad[0-9]/)) {
    return { code, accelerator: `num${code[6]}`, modifier: false };
  }

  // numdec - decimal key
  if (code === "NumpadDecimal") {
    return { code, accelerator: "numdec", modifier: false };
  }

  // numadd - numpad + key
  if (code === "NumpadAdd") {
    return { code, accelerator: "numadd", modifier: false };
  }

  // numsub - numpad - key
  if (code === "NumpadSubtract") {
    return { code, accelerator: "numsub", modifier: false };
  }

  // nummult - numpad * key
  if (code === "NumpadMultiply") {
    return { code, accelerator: "nummult", modifier: false };
  }

  // numdiv - numpad ÷ key
  if (code === "NumpadDivide") {
    return { code, accelerator: "numdiv", modifier: false };
  }

  // No match
  return null;
}
