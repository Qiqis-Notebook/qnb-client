import { useTheme } from "next-themes";
import { useMemo } from "react";
import { ToastContainer } from "react-toastify";

export default function ToastWrapper() {
  const { theme } = useTheme();

  const toastTheme = useMemo(() => {
    switch (theme) {
      case "light":
        return "light";
      case "dark":
        return "dark";
      default:
        return "dark";
    }
  }, [theme]);
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      limit={2}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={toastTheme}
    />
  );
}
