import type { Metadata } from "next";
import { Inter } from "next/font/google";

// import { AuthProvider } from "@/contexts/AuthContext";
import TanstackProvider from "@/providers/TanstackProvider";
import { MacroProvider } from "@/contexts/MacroservicesContext";
import { SubserviceProvider } from "@/contexts/SubservicesContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NextUiProvider from "@/providers/NextUiProvider";
import ButtonMenu from "@/components/ButtonMenu";
import { ConstructionProvider } from "@/contexts/ConstructionsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Obras Almeida",
  description: "Obras Almeida",
};

export type Navigation = {
  name: string;
  href: string;
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation: Navigation[] = [
    { name: "Cadastro de Obras", href: "/home/cadastro/obras" },
    { name: "Cadastro de Usuários", href: "/home/cadastro/usuarios" },
    { name: "Cadastro de Funcionários", href: "/home/cadastro/funcionarios" },
    { name: "Folha de Presença", href: "/home/presenca" },
  ];

  return (
    <section className="flex relative">
        <NextUiProvider>
          <TanstackProvider>
            <ConstructionProvider>
              <MacroProvider>
                <SubserviceProvider>
                  <ButtonMenu />
                    {children}
                  <ToastContainer autoClose={2000} />
                </SubserviceProvider>
              </MacroProvider>
            </ConstructionProvider>
          </TanstackProvider>
        </NextUiProvider>
    </section>
  );
}
