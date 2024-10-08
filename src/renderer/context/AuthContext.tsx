"use client";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// Types
interface AuthUser {
  id: string;
  name: string;
  image: string;
  authAvatar: string;
}
type LoadingUser = { user: AuthUser | null; status: "loading" };
type AuthenticatedUser = {
  user: AuthUser;
  status: "authenticated";
};
type UnauthenticatedUser = {
  user: null;
  status: "unauthenticated";
};
export type AuthState = LoadingUser | AuthenticatedUser | UnauthenticatedUser;
interface DefaultValues {
  session: AuthState;
}
type Action = { type: "SESSION"; value: AuthState } | { type: any; value: any };

// Default values
const initialState: DefaultValues = {
  session: {
    user: null,
    status: "unauthenticated",
  },
};

// Context initialization
const Auth = createContext<[DefaultValues, React.Dispatch<Action>]>([
  initialState,
  () => {},
]);
Auth.displayName = "AuthContext";

// Function reducers
function reducer(state: DefaultValues, action: Action): DefaultValues {
  switch (action.type) {
    case "SESSION": {
      return { ...state, session: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Context provider
function AuthProvider({ children }: { children: ReactNode }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  const checkSession = useCallback(async () => {
    try {
      const payload = await window.electron.ipcRenderer.session();
      return payload;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    setSession(dispatch, { user: null, status: "loading" });

    // Listen to auth events
    window.electron.ipcRenderer.on("auth", (arg: AuthUser | null) => {
      if (!mounted || !arg) return;
      setSession(dispatch, { user: arg, status: "authenticated" });
    });

    // Trigger session check
    checkSession().then((resp) => {
      if (!mounted) return;
      if (resp) {
        setSession(dispatch, { user: resp, status: "authenticated" });
      } else {
        setSession(dispatch, { user: null, status: "unauthenticated" });
      }
    });
    return () => {
      mounted = false;
    };
  }, [checkSession, setSession, dispatch]);

  return (
    <Auth.Provider value={value as [DefaultValues, React.Dispatch<Action>]}>
      {children}
    </Auth.Provider>
  );
}

// Context hook
function useAuthController() {
  const context = useContext(Auth);

  if (!context) {
    throw new Error("useAuthController requires a provider");
  }

  return context;
}

// Context module functions
const setSession = (dispatch: React.Dispatch<Action>, value: AuthState) =>
  dispatch({ type: "SESSION", value });

export { AuthProvider, useAuthController, setSession };
