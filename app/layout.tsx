import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ClassesProvider } from "@/context/ClassesContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Smart Routine Hub",
  description: "Class routine creation and management for university teachers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            <ClassesProvider>{children}</ClassesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
