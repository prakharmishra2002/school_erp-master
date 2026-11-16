import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "EduVerse - School Management System",
  description: "A comprehensive school ERP system for managing students, teachers, attendance, fees, and more.",
  keywords: ["school", "ERP", "management", "education", "students", "teachers"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster position="top-right" expand={false} richColors />
      </body>
    </html>
  );
}
