"use client";
import { NavLink, useLocation } from "react-router-dom";

// Utils
import classNames from "classnames";

// Types
import { routes as RouteProp } from "@Types/RouteTypes";

// Nav Icon styles
const iconStyle = {
  className: "block h-6 w-6",
  "aria-hidden": true,
};

function NavList({ routes }: { routes: typeof RouteProp }) {
  const { pathname } = useLocation();
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
                        pathname === object.url,
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
              <div className="flex h-8 items-center rounded px-2">
                {object.icon && <Icon {...iconStyle} />}
                <div className="mx-2 font-normal">{object.title}</div>
              </div>
            )}
            {object.child && (
              <div className="flex flex-col space-y-1">
                <hr className="border-1 border-base-content opacity-20" />
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
                          "flex h-8 items-center rounded pl-6 font-light",
                          {
                            "bg-primary text-primary-content":
                              pathname === item.url,
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
