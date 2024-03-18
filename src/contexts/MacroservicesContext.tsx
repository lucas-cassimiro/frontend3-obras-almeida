"use client";
import type React from "react";
import { createContext, useContext, type ReactNode, useEffect } from "react";
import { destroyCookie, parseCookies } from "nookies";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  findSubservice,
  userRegister,
} from "@/requests/MacroAndSubServiceContext";

const MacroserviceContext = createContext<any>({});

export const MacroProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => await userRegister(),
    retry: false,
  });

  return (
    <MacroserviceContext.Provider value={{ data, error, isLoading }}>
      {children}
    </MacroserviceContext.Provider>
  );
};

export const useMacro = () => {
  const context = useContext(MacroserviceContext);
  return context;
};
