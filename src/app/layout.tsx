import type { Metadata } from "next";
import { Libre_Baskerville, Noto_Sans_Malayalam } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const malayalam = Noto_Sans_Malayalam({
  variable: "--font-noto-malayalam",
  subsets: ["malayalam"],
});

export const metadata: Metadata = {
  title: "THWARA",
  description: "An independent bilingual digital media collective exploring knowledge, culture and society through critical thought and creative expression.",
  icons: {
    icon: [
      { url: "/image.png" },
      { url: "/icon.png" },
    ],
    shortcut: "/image.png",
    apple: "/image.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${malayalam.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col pt-0">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
