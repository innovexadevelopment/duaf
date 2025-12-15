import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Always fetch fresh data from Supabase (no static caching)
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "DUAF - Making a Difference Together",
  description: "DUAF is a non-profit organization dedicated to creating positive change in our communities through impactful programs and initiatives.",
  keywords: "NGO, non-profit, charity, community, humanitarian, volunteer, donate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

