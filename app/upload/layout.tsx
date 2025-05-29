import { Metadata } from 'next'
import { generateSEOMetadata, seoData } from '@/src/components/SEOHead'

export const metadata: Metadata = generateSEOMetadata(seoData.upload)

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 