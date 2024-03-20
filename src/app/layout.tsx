import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
// import { AuthProvider } from "@/contexts/AuthContext";
import NextUiProvider from "@/providers/NextUiProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Obras Almeida",
  description: "Obras Almeida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <NextUiProvider>{children}</NextUiProvider>
      </body>
    </html>
  );
}
