import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentPilot - Your Personal AI Workforce",
  description: "Build AI agents in minutes with natural language. No code required.",
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
      </body>
    </html>
  );
}
