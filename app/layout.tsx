import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "얼평대결 - AI 얼굴 평가 대결",
  description: "AI가 당신의 얼굴을 평가하고, 다른 사람들과 대결해보세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
            <a href="/" className="text-xl font-bold text-blue-600">얼평대결</a>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="/upload" className="hover:text-blue-600">업로드</a></li>
                <li><a href="/battle" className="hover:text-blue-600">대결</a></li>
                <li><a href="/ranking" className="hover:text-blue-600">랭킹</a></li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto p-4 py-8">
          {children}
        </main>
        
        <footer className="bg-gray-100 mt-8 py-6">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} 얼평대결. 모든 권리 보유.</p>
            <p className="mt-2">이 서비스는 AI를 사용하여 재미 목적으로만 제공됩니다. 실제 평가 기준으로 활용하지 마세요.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
