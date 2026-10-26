import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Battlexa Esports Arena | Free Fire Esports",
  description: "Tournaments, scrims, results and community updates from Battlexa Esports Arena.",\n  ...(process.env.NEXT_PUBLIC_SITE_URL ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
