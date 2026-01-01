import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Spanish Tutor",
  description: "Meet Miguel, your AI spanish instructor",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "AI Spanish Tutor",
    description: "Meet Miguel, your AI spanish instructor",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}