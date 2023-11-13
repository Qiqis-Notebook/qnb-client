import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// CSS
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

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

export default function App() {
  return (
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
    </ThemeProvider>
  );
}
