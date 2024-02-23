import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import UserProvider from "../components/UserProvider";
import ThemeProvider from "@/components/ThemeProvider";
import localFont from "next/font/local";

const WorkSans = localFont({
  src: [
    {
      path: "./WorkSans-VariableFont_wght.ttf",
      style: "normal",
    },
    { path: "./WorkSans-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  display: "swap",
  variable: "--font-WorkSans",
});

export const metadata: Metadata = {
  title: "Herbivorous",
  description: "Daily dozen nutrition tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${WorkSans.variable} font-sans font-medium`}>
      <ThemeProvider>
        <UserProvider>
          <body className="flex min-h-screen flex-col p-6 sm:p-12 max-w-4xl mx-auto justify-between">
            <Nav />
            <main className="flex-1 mb-20">{children}</main>
            <Footer />
          </body>
        </UserProvider>
      </ThemeProvider>
    </html>
  );
}
