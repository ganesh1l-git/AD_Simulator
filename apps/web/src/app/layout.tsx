import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IADES — Indian Air Defence Educational Simulator",
  description: "An educational air defence simulation platform focused on Indian air defence concepts. Learn how layered air defence works through interactive simulations, budgeting, procurement, and radar coverage visualization.",
  keywords: ["air defence", "simulator", "educational", "India", "military", "radar", "missile defence"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#0a0e17]">
        {children}
      </body>
    </html>
  );
}
