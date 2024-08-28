// Assets
import { LogOutIcon, UserIcon } from "lucide-react";
import Logo from "@Assets/qiqiLogo.png";

// Config
import { LOGIN_URL } from "@Config/constants";

// Authentication
import { useAuth } from "../lib/useAuth";
import classNames from "classnames";
import Spinner from "./Spinner";

export default function AuthButton() {
  const { session, signOut } = useAuth();
  const { user, status } = session;

  async function handleSignOut() {
    if (status === "loading") return;
    await signOut();
  }

  if (status === "unauthenticated") {
    return (
      <a
        href={LOGIN_URL}
        target="_blank"
        className="btn btn-block justify-normal"
      >
        <UserIcon /> Login
      </a>
    );
  }
  return (
    <button
      className={classNames(
        "btn btn-block p-1",
        {
          "btn-disabled justify-center": status === "loading",
        },
        { "justify-normal": status !== "loading" }
      )}
      onClick={handleSignOut}
      title={
        status === "loading"
          ? ""
          : status === "authenticated"
          ? "Logout"
          : "Login"
      }
    >
      {status === "loading" && <Spinner />}
      {status === "authenticated" && (
        <div className="inline-flex items-center w-full gap-1">
          <img
            src={user.image}
            width={32}
            height={32}
            alt="User Icon"
            className="rounded-full shrink-0"
            onError={(e) => {
              {
                e.currentTarget.src = Logo;
              }
            }}
          />
          <div className="truncate shrink grow text-left">{user.name}</div>
          <LogOutIcon className="shrink-0" />
        </div>
      )}
    </button>
  );
}
