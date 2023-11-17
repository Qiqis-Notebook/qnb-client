import { ReactNode } from "react";

// Hooks
import { useTheme } from "next-themes";

// Component
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export default function StyledScrollbar({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  const getTheme = (theme: string) => {
    switch (theme) {
      case "light":
        return "os-theme-dark";
      case "dark":
        return "os-theme-light";

      default:
        break;
    }
  };

  return (
    <OverlayScrollbarsComponent
      options={{
        scrollbars: {
          theme: getTheme(theme),
        },
      }}
      defer
      className="pr-3"
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
