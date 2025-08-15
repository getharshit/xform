import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FormBuilder - Create Beautiful Forms",
  description:
    "Effortlessly create, customize, and share forms with the help of AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
