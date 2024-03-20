"use client";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const ConstructionContext = createContext<any>({});

export const ConstructionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [constructionData, setConstructionData] = useState<any>({});

  const mountBody = (data: any) => {
    setConstructionData(data);
  };

  // useEffect para observar mudanças nos dados e atualizar o estado conforme necessário
  useEffect(() => {
    console.log("Dados da construção atualizados:", constructionData);
  }, [constructionData]);

  return (
    <ConstructionContext.Provider value={{ mountBody, constructionData }}>
      {children}
    </ConstructionContext.Provider>
  );
};

export const useConstruction = () => {
  const context = useContext(ConstructionContext);
  return context;
};
