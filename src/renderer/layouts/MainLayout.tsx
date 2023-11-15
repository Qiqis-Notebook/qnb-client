import { Outlet } from "react-router-dom";

// Components
import NavBar from "@Components/NavBar";

export default function MainLayout() {
  return (
    <div className="w-screen flex flew-row h-screen">
      {/* Navbar */}
      <div className="w-52 shrink-0">
        <NavBar />
      </div>
      <Outlet />
    </div>
  );
}
