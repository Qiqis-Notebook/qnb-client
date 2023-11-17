import { useEffect } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

// CSS
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "overlayscrollbars/overlayscrollbars.css";

// Context
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "next-themes";

// Data
import themes from "@Config/themes.json";

// Layouts
import MainLayout from "@Layouts/MainLayout";
import FullPageLayout from "@Layouts/FullPageLayout";
import RouteLayout from "@Layouts/RouteLayout";

// Pages
import MainPage from "@Pages/MainPage";
import SettingPage from "@Pages/SettingPage";
import FavoritePage from "@Pages/FavoritePage";
import RecentPage from "@Pages/RecentPage";
import SearchPage from "@Pages/SearchPage";
import RoutePage from "@Pages/RoutePage";

// Components
import { ToastContainer, toast } from "react-toastify";

export default function App() {
  // Connection status
  useEffect(() => {
    const updateOnlineStatus = () => {
      navigator.onLine
        ? toast.success("Connected", { autoClose: false })
        : toast.error("Connection lost", { autoClose: false });
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);
  return (
    <SettingsProvider>
      <ThemeProvider
        attribute="data-theme"
        themes={themes.map((item) => item.value)}
        defaultTheme="dark"
      >
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="routes" element={<RouteLayout />}>
                <Route path="favorites" element={<FavoritePage />} />
                <Route path="recent" element={<RecentPage />} />
                <Route path="search" element={<SearchPage />} />
              </Route>
              <Route path="setting" element={<SettingPage />} />
            </Route>
            <Route path="route" element={<FullPageLayout />}>
              <Route path=":rid" element={<RoutePage />} />
            </Route>
          </Routes>
        </Router>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          limit={2}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ThemeProvider>
    </SettingsProvider>
  );
}
