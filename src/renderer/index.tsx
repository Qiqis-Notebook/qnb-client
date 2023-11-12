import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("app") as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once("ipc-bridge", (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage("ipc-bridge", ["ping"]);
