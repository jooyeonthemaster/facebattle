import { Metadata } from 'next'
import { generateSEOMetadata, seoData } from '@/src/components/SEOHead'

export const metadata: Metadata = generateSEOMetadata(seoData.battle)

export default function BattleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 