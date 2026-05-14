"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiRequest } from "../../utils/api";
import { ROLES } from "../../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  const checkAuth = useCallback(async () => {
    try {
      const res = await apiRequest("/auth/me", { method: "GET" });
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = async (email, password) => {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (res.success && res.data) {
      setUser(res.data);
      return res;
    }

    throw new Error(res.message || "Login gagal");
  };

  // Logout
  const logout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // Ignore errors on logout
    } finally {
      setUser(null);
    }
  };

  // Register
  const register = async (formData, isFormDataType = false) => {
    const options = {
      method: "POST",
    };

    if (isFormDataType) {
      options.body = formData; // FormData for file uploads
    } else {
      options.body = formData;
    }

    const res = await apiRequest("/auth/register", options);
    return res;
  };

  const getDashboardPath = (userData = null) => {
    const currentUser = userData || user;
    if (!currentUser) return "/";
    const roleId = Number(currentUser.id_role);
    if (roleId === ROLES.RELAWAN) return "/dashboard/relawan";
    if (roleId === ROLES.SISWA) return "/dashboard/siswa";
    return "/";
  };
 
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    checkAuth,
    getDashboardPath,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
