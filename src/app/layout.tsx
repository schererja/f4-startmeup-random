import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "~/trpc/react";
import { TopNav } from "./_components/topnav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Fallout 4 Random Start Me Up",
  description: "Generate random character builds for Fallout 4 Start Me Up mod",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`min-h-screen bg-background font-sans antialiased ${inter.variable}`}
        >
          <TopNav />
          <main className="flex-1">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
