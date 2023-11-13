import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// CSS
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

// Data
import themes from "@Config/themes.json";

// Components
import MainLayout from "./layouts/MainLayout";
import MainPage from "@Pages/MainPage";
import SettingPage from "@Pages/SettingPage";
import FavoritePage from "@Pages/FavoritePage";
import RecentPage from "@Pages/RecentPage";
import SearchPage from "@Pages/SearchPage";
import RouteLayout from "@Layouts/RouteLayout";

export default function App() {
  return (
    <ThemeProvider
      attribute="data-theme"
      themes={themes.map((item) => item.value)}
      defaultTheme="dark"
    >
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="routes" element={<RouteLayout />}>
              <Route path="favorites" element={<FavoritePage />} />
              <Route path="recent" element={<RecentPage />} />
              <Route path="search" element={<SearchPage />} />
            </Route>
            <Route path="setting" element={<SettingPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}
