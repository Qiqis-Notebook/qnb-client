// Components
import NavBar from "@Components/NavBar";
import { Outlet } from "react-router-dom";

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
