import type { Metadata } from "next";
import Footer from "@/src/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "마법의 거울 - AI 얼굴 분석 및 미모 대결",
  description: "AI 마법사가 당신의 아름다움을 분석하고, 다른 도전자들과 미모 대결을 펼쳐보세요!",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
