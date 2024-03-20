"use client";

import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, useCallback } from "react";

import { setCookie, destroyCookie, parseCookies } from "nookies";

import { FormData } from "@/app/page";

type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  created_at: Date;
  permission_id: number;
};

type AuthContextType = {
  isAuthenticated: boolean;
  //   isLoading: boolean;
  user: User | null;
  signIn: (data: FormData) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    const { "smartstore.token": token } = parseCookies();

    if (token) {
      fetch("http://191.101.70.229:3333/users/profile", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  async function signIn({ username, password_hash }: FormData) {
    try {
      const url = "http://191.101.70.229:3333/users/login";

      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password_hash }),
      });

      if (!request.ok) {
        const error = await request.json();
        throw new Error(error.message);
      }

      const response = await request.json();

      setCookie(response, "obrasalmeida.token", response.token, {
        maxAge: 60 * 60 * 1, //1h
      });

      setUser(response.user);

      router.push("/home");

      return response;
    } catch (error) {
      throw error;
    }
  }

  const signOut = useCallback(() => {
    destroyCookie(null, "obrasalmeida.token");
    setUser(null);

    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
