"use client";
import type React from "react";
import { createContext, useContext, type ReactNode, useEffect } from "react";
import { destroyCookie, parseCookies } from "nookies";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { findSubservice, userRegister } from "@/requests/MacroAndSubServiceContext";

const SubserviceContext = createContext<any>({});

export const SubserviceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
    const {
        data: subservice,
        error: subError,
        isLoading: subIsLoading,
      } = useQuery({
        queryKey: ["sub"],
        queryFn: async () => await findSubservice(),
        retry: false,
      });

  return (
    <SubserviceContext.Provider value={{ subservice, subError, subIsLoading }}>
      {children}
    </SubserviceContext.Provider>
  );
};

export const useSub = () => {
  const context = useContext(SubserviceContext);
  return context;
};
