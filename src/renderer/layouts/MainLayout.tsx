// Components
import NavBar from "@Components/NavBar";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen flex flew-row">
      {/* Navbar */}
      <div className="w-52">
        <NavBar />
      </div>
      {children}
    </div>
  );
}
