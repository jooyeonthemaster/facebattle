import { Metadata } from 'next'

interface SEOHeadProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  noindex?: boolean
}

export function generateSEOMetadata({
  title,
  description = "AI 마법사가 당신의 아름다움을 분석하고, 다른 도전자들과 미모 대결을 펼쳐보세요! 무료 AI 얼평, 얼굴 점수 측정, 미모 채점 서비스",
  canonical,
  ogImage = '/og-image.png',
  noindex = false
}: SEOHeadProps = {}): Metadata {
  const baseUrl = 'https://facebattle.vercel.app'
  const pageTitle = title ? `${title} | 마법의 거울` : '마법의 거울 - AI 얼굴 분석 및 미모 대결'
  
  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : baseUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      siteName: "마법의 거울",
      locale: 'ko_KR',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
    },
  }
}

// 페이지별 SEO 데이터
export const seoData = {
  home: {
    title: "AI 얼굴 분석 및 미모 대결",
    description: "AI 마법사가 당신의 아름다움을 분석하고, 다른 도전자들과 미모 대결을 펼쳐보세요! 무료 AI 얼평, 얼굴 점수 측정, 미모 채점 서비스",
    canonical: "/",
  },
  upload: {
    title: "AI 얼굴 분석 시작하기",
    description: "사진을 업로드하고 AI가 분석하는 당신의 미모 점수를 확인해보세요. 무료 AI 얼평 서비스",
    canonical: "/upload",
  },
  battle: {
    title: "실시간 미모 대결",
    description: "다른 사용자들과 실시간으로 미모 대결을 펼쳐보세요. AI가 공정하게 승부를 판정합니다",
    canonical: "/battle",
  },
  ranking: {
    title: "미모 랭킹",
    description: "AI 얼평 랭킹을 확인하고 최고 미모의 주인공들을 만나보세요",
    canonical: "/ranking",
  },
} 