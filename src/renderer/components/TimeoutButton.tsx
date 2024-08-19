import { useState, useCallback, useEffect } from "react";

// Types
import type { ReactNode } from "react";

interface TimeoutButtonProps {
  onClick: () => void;
  disabled?: boolean;
  timeOut?: number;
  className?: string;
  children?: ReactNode;
}

export default function TimeoutButton({
  onClick,
  disabled = false,
  timeOut = 0,
  className = "btn",
  children,
}: TimeoutButtonProps) {
  const [isDisabled, setIsDisabled] = useState(disabled);
  let timeoutId: NodeJS.Timeout | null = null;

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onClick();
      if (timeOut > 0) {
        setIsDisabled(true);
        timeoutId = setTimeout(() => setIsDisabled(false), timeOut * 1000);
      }
    }
  }, [isDisabled, onClick, timeOut]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isDisabled}
      className={className}
    >
      {children}
    </button>
  );
}
