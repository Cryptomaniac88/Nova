import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import CompanionWidget from "./components/CompanionWidget";

export const metadata: Metadata = {
  title: "Nova",
  description: "AI Companion Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto relative">
            {children}
            <CompanionWidget />
          </main>
        </div>
      </body>
    </html>
  );
}