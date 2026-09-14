import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("sg_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = useCallback(async (email, password, role = "admin") => {
    const { token, user: loggedInUser } = await api.login(email, password, role);
    localStorage.setItem("sg_token", token);
    localStorage.setItem("sg_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const switchRole = useCallback(async (targetRole) => {
    try {
      const res = await api.switchRole(targetRole);
      if (res?.token && res?.user) {
        localStorage.setItem("sg_token", res.token);
        localStorage.setItem("sg_user", JSON.stringify(res.user));
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.warn("Failed to switch role via backend, updating locally:", err);
      const updated = { ...(user || {}), role: targetRole, region: targetRole === "admin" ? "global" : "US-West" };
      localStorage.setItem("sg_user", JSON.stringify(updated));
      setUser(updated);
      return updated;
    }
  }, [user]);

  const register = useCallback(async (name, email, password, role = "shipment_user") => {
    const { token, user: registeredUser } = await api.register(name, email, password, role);
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
    <AuthContext.Provider value={{ user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

