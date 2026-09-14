import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("sg_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = useCallback(async (email, password) => {
    const { token, user: loggedInUser } = await api.login(email, password);
    localStorage.setItem("sg_token", token);
    localStorage.setItem("sg_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { token, user: registeredUser } = await api.register(name, email, password);
    localStorage.setItem("sg_token", token);
    localStorage.setItem("sg_user", JSON.stringify(registeredUser));
    setUser(registeredUser);
    return registeredUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sg_token");
    localStorage.removeItem("sg_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

