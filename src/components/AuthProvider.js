"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChangedListener, logOutUser } from "@/firebase/auth";
import { syncUserToFirestore } from "@/firebase/db";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Subscribe to Firebase (or simulated) Auth State changes
    const unsubscribe = onAuthStateChangedListener((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        syncUserToFirestore(currentUser);
      }

      // Simple routing guard
      const publicPaths = ["/", "/login", "/signup", "/api/webhook", "/api/oauth/callback"];
      const isPublicPath = publicPaths.includes(pathname);

      if (!currentUser && !isPublicPath) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const logout = async () => {
    setLoading(true);
    try {
      await logOutUser();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
