import { Metadata } from 'next'
import { generateSEOMetadata, seoData } from '@/src/components/SEOHead'

export const metadata: Metadata = generateSEOMetadata(seoData.ranking)

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 