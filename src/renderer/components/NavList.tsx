"use client";
import { Fragment } from "react";
import { NavLink, useLocation } from "react-router-dom";

// Context
import { useSettings } from "@Context/SettingsContext";

// Utils
import classNames from "classnames";

// Types
import type { routes as RouteProp } from "@Types/RouteTypes";

// Nav Icon styles
const iconStyle = {
  className: "block h-6 w-6",
  "aria-hidden": true,
};

function NavList({ routes }: { routes: typeof RouteProp }) {
  const { pathname } = useLocation();
  const { settings } = useSettings();
  return (
    <>
      {routes.map((object, i) => {
        const Icon = object?.icon || null;
        return (
          <div className="flex flex-shrink-0 flex-col" key={`nav-item-${i}`}>
            {object.url ? (
              <NavLink
                to={object.url}
                className={({ isActive, isPending }) =>
                  `flex-shrink-0 ${
                    isPending ? "pending" : isActive ? "active" : ""
                  }`
                }
              >
                <div
                  className={classNames(
                    "flex h-8 items-center rounded px-2 font-normal",
                    {
                      "bg-primary text-primary-content":
                        pathname === object.url &&
                        !settings.mainWindow.reducedColor,
                    },
                    {
                      "bg-base-300 text-base-content":
                        pathname === object.url &&
                        settings.mainWindow.reducedColor,
                    },
                    {
                      "hover:bg-base-100 hover:text-base-content":
                        pathname !== object.url,
                    }
                  )}
                >
                  {object.icon && <Icon {...iconStyle} />}
                  <div className="mx-2">{object.title}</div>
                </div>
              </NavLink>
            ) : (
              <Fragment>
                {object.child && (
                  <hr className="border-1 my-1 border-base-content opacity-20" />
                )}
                <div className="flex h-8 items-center rounded px-2 text-sm">
                  {object.icon && <Icon {...iconStyle} />}
                  <div className="mx-2 truncate font-bold">{object.title}</div>
                </div>
              </Fragment>
            )}
            {object.child && (
              <div className="flex flex-col space-y-1">
                {object.child.map((item, j) => {
                  const ItemIcon = item?.icon;
                  return (
                    <NavLink
                      to={item.url}
                      className={({ isActive, isPending }) =>
                        `flex-shrink-0 ${
                          isPending ? "pending" : isActive ? "active" : ""
                        }`
                      }
                      key={`nav-item-${i}-${j}`}
                    >
                      <div
                        className={classNames(
                          "flex h-8 items-center rounded pl-8 font-light",
                          {
                            "bg-primary text-primary-content":
                              pathname === item.url &&
                              !settings.mainWindow.reducedColor,
                          },
                          {
                            "bg-base-300 text-base-content":
                              pathname === item.url &&
                              settings.mainWindow.reducedColor,
                          },
                          {
                            "hover:bg-base-100 hover:text-base-content":
                              pathname !== item.url,
                          }
                        )}
                      >
                        {item.icon && <ItemIcon {...iconStyle} />}
                        <div className="mx-2">{item.title}</div>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
export default NavList;
