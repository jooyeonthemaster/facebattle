import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "얼평대결 - AI 얼굴 평가 대결",
  description: "AI가 당신의 얼굴을 평가하고, 다른 사람들과 대결해보세요!",
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
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-564ZGL7M');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-564ZGL7M"
            height="0" 
            width="0" 
            style={{display:'none', visibility:'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <header className="bg-white shadow-sm">
         
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
