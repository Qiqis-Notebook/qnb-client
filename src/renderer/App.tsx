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

// Pages
import MainPage from "@Pages/MainPage";
import SettingPage from "@Pages/SettingPage";
import FavoritePage from "@Pages/FavoritePage";
import RecentPage from "@Pages/RecentPage";
import SearchPage from "@Pages/SearchPage";
import RoutePage from "@Pages/RoutePage";

// Components
import { AuthProvider } from "@Context/AuthContext";
import EventHandler from "@Components/EventHandler";
import ToastWrapper from "./lib/ToastWrapper";

export default function App() {
  return (
    <SettingsProvider>
      <ThemeProvider
        attribute="data-theme"
        themes={themes.map((item) => item.value)}
        defaultTheme="dark"
      >
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="routes">
                  <Route path="recent" element={<RecentPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="favorites" element={<FavoritePage />} />
                </Route>
                <Route path="setting" element={<SettingPage />} />
              </Route>
              <Route path="route" element={<FullPageLayout />}>
                <Route path=":rid" element={<RoutePage />} />
              </Route>
            </Routes>
            <EventHandler />
          </Router>
        </AuthProvider>
        <ToastWrapper />
      </ThemeProvider>
    </SettingsProvider>
  );
}
