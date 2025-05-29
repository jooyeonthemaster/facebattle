import type { Metadata } from "next";
import Footer from "@/src/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "마법의 거울 - AI 얼굴 분석 및 미모 대결",
    template: "%s | 마법의 거울"
  },
  description: "AI 마법사가 당신의 아름다움을 분석하고, 다른 도전자들과 미모 대결을 펼쳐보세요! 무료 AI 얼평, 얼굴 점수 측정, 미모 채점 서비스",
  keywords: ["AI 얼평", "얼굴 분석", "미모 대결", "AI 미모 테스트", "얼굴 점수", "미모 채점", "AI face rating", "beauty score", "facial analysis", "무료 얼평"],
  authors: [{ name: "FaceBattle Team" }],
  creator: "FaceBattle",
  publisher: "FaceBattle",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://facebattle.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/',
    },
  },
  openGraph: {
    title: "마법의 거울 - AI 얼굴 분석 및 미모 대결",
    description: "AI 마법사가 당신의 아름다움을 분석하고, 다른 도전자들과 미모 대결을 펼쳐보세요!",
    url: 'https://facebattle.vercel.app',
    siteName: "마법의 거울",
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '마법의 거울 - AI 얼굴 분석 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "마법의 거울 - AI 얼굴 분석 및 미모 대결",
    description: "AI 마법사가 당신의 아름다움을 분석하고, 다른 도전자들과 미모 대결을 펼쳐보세요!",
    creator: '@facebattle',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'q0g9hCTUqrpkfNik0aQg1CKsYiaYoUoEs9mD_f7asQg',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
  },
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '마법의 거울',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    description: 'AI 기술을 활용한 얼굴 분석 및 미모 대결 서비스입니다. 무료로 AI 얼평을 받고 다른 사용자들과 미모 대결을 즐겨보세요.',
    url: 'https://facebattle.vercel.app',
    author: {
      '@type': 'Organization',
      name: 'FaceBattle Team'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1200'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW'
    },
    featureList: [
      'AI 얼굴 분석',
      '미모 점수 측정',
      '실시간 미모 대결',
      '얼굴 특징 분석',
      '미모 랭킹 시스템'
    ]
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics (GA4) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `
        }} />
        
        {/* Naver Analytics */}
        <script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            if(!wcs_add) var wcs_add = {};
            wcs_add["wa"] = "YOUR_NAVER_ANALYTICS_ID";
            if(window.wcs) {
              wcs.inflow();
              wcs.visit();
              wcs_do();
            }
          `
        }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
