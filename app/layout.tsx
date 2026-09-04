// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HawhoopNews - Portal Doksli",
  description: "Informasi terkini, akurat, berimbang, dan timpaan selalu ready.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Children akan diisi oleh layout spesifik (admin atau public) */}
        {children}
      </body>
    </html>
  );
}