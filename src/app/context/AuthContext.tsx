import { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile } from "../data/mockData";

interface AuthContextValue {
  currentUser: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const login = (user: UserProfile) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
