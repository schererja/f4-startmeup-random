import "~/styles/globals.css";
import "~/app/(overlay)/_components/overlay-animations.css";

import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Overlay layout: no TopNav, no Clerk auth, no chrome.
// OBS browser sources point at /overlay/[game]/[uuid] — these pages must be public and minimal.
export const metadata = {
  title: "OBS Overlay",
};

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          body {
            background: transparent !important;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
        `}</style>
      </head>
      <body className={`font-sans antialiased ${inter.variable}`}>
        {/* pointer-events: none — overlays must not intercept OBS interaction */}
        <div style={{ pointerEvents: "none" }}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </div>
      </body>
    </html>
  );
}
