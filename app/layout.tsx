import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pattern Studio — Patrones de Costura Digitales",
  description:
    "Patrones de costura digitales para la creadora contemporánea. Descarga, imprime y crea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={geist.variable}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
