import type { Metadata } from "next";
import { Libre_Bodoni, Noto_Sans_Malayalam } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
});

const malayalam = Noto_Sans_Malayalam({
  variable: "--font-noto-malayalam",
  subsets: ["malayalam"],
});

export const metadata: Metadata = {
  title: "THWARA",
  description: "An independent bilingual digital media collective exploring knowledge, culture and society through critical thought and creative expression.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreBodoni.variable} ${malayalam.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col pt-0">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
