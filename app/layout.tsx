import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hero Orbit Deck",
  description: "Monochrome hero component with orbital animations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
