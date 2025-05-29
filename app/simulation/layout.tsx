import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시뮬레이션 - 얼굴대결',
  description: '두 이미지를 직접 비교해보세요',
};

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 