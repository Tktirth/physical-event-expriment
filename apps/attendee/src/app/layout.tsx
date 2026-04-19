import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniFlow | Smart Event Navigator",
  description: "AI-powered crowd navigation for live events. Get optimal routes, live queue times, and real-time venue intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#050505" />
      </head>
      <body>{children}</body>
    </html>
  );
}
