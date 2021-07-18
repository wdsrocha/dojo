/*
Based on:
- https://dev.to/rafacdomin/autenticacao-no-react-com-context-api-e-hooks-4bia
- https://github.com/nextauthjs/next-auth/blob/main/src/client/index.js

Will probably refactor this into https://next-auth.js.org/ in the future, with help of:
- https://www.youtube.com/watch?v=dXM-ahRNNhc
- https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies
- https://dev.to/twisha/using-credentials-provider-with-a-custom-backend-in-nextauth-js-43k4
*/
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { OPTIONS } from "../utils/fetchOptions";

export interface User {
  username: string;
  avatarUrl?: string;
}

export interface Session {
  user: User;
}

interface AuthContextProps {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
}

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  setSession: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const storedSession = localStorage.getItem("@App:session");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    } else {
      setSession(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  const { session, setSession } = useContext(AuthContext);

  /**
   * @param username
   * @param password
   * @returns status code
   */
  const login = async (username: string, password: string): Promise<number> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/login`,
        {
          ...OPTIONS,
          method: "POST",
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      if (!response.ok) {
        return response.status;
      }

      const newSession: Session = { user: { username } };
      setSession(newSession);
      try {
        localStorage.setItem("@App:session", JSON.stringify(newSession));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      return response.status;
    } catch (error) {
      return error?.statusCode ?? 500;
    }
  };

  const logout = async (): Promise<void> => {
    // TODO: handle failure
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/logout`,
      {
        ...OPTIONS,
        method: "POST",
      },
    );
    localStorage.removeItem("@App:session");
    setSession(null);
  };

  return { session, login, logout };
};
