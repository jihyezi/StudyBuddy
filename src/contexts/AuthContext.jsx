import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "components/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      console.log("Fetched session:", session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
        console.log("Auth state changed:", session);
      }
    );

    return () => {
      if (authListener && typeof authListener.unsubscribe === "function") {
        authListener.unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("userId"); // 로컬 스토리지에서 userId 제거
    localStorage.removeItem("sb-vrpwhfbfzqwmqlhwhbtu-auth-token"); // 인증 토큰 제거
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
