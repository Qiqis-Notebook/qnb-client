// Hooks
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";

// Assets
import Logo from "@Assets/qiqiLogo.png";
import DiscordIcon from "@Assets/DiscordIcon";
import { Settings } from "lucide-react";

// Config
import { isDev } from "@Config/constants";

// Data
import themes from "@Config/themes.json";
import { routes } from "@Config/routes";

// Components
import NavList from "@Components/NavList";
import AuthButton from "./AuthButton";

export default function NavBar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen flex-col overflow-y-auto overscroll-contain bg-base-200">
      {/* Logo */}
      <div className="mx-2 flex flex-shrink-0 items-center justify-between py-2">
        <Link to="/" className="hidden h-9 items-center min-[0px]:flex">
          <img
            className="mr-1 min-w-0"
            src={Logo}
            alt="QNB Logo"
            width={32}
            height={32}
          />
          <div className="relative flex items-center">Qiqi&apos;s Notebook</div>
        </Link>
      </div>
      {/* Nav */}
      <div className="px-2 pt-2 grow">
        <NavList routes={routes} />
      </div>
      <div className="mx-2">
        <AuthButton />
      </div>
      {/* Bottom info panel */}
      <div className="px-2 pb-2 space-y-1">
        <hr className="border-1 my-1 border-base-content opacity-20" />
        <select
          className="select-bordered select select-sm w-full font-normal"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {themes.map((item, idx) => (
            <option value={item.value} key={`theme-${idx}`}>
              {item.label}
            </option>
          ))}
        </select>
        <div className="flex flex-row gap-1">
          <Link to="/setting" className="btn-ghost btn-square btn-sm btn">
            <Settings className="w-full h-full" />
          </Link>
          <a
            className="btn-ghost btn-square btn-sm btn"
            href="https://discord.gg/xyddRPYSdD"
            target="_blank"
          >
            <DiscordIcon />
          </a>
        </div>
        {isDev && <div className="text-xs">Development Build</div>}
      </div>
    </div>
  );
}
