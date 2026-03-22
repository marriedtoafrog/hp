import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Humor Project",
  description: "Caption voting for funny AI-generated captions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
