import { Metadata } from 'next';
import { getBattleResult } from '@/src/lib/firebaseService';
import SharedBattleResultClient from './SharedBattleResultClient';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// 동적 메타데이터 생성 함수
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const battleId = resolvedParams.id;
  
  try {
    const battleResult = await getBattleResult(battleId);
    
    if (!battleResult) {
      return {
        title: '얼평대결 - 배틀 결과를 찾을 수 없습니다',
        description: '요청하신 배틀 결과를 찾을 수 없습니다.',
      };
    }
    
    const { winner, image1, image2, battle } = battleResult;
    const loser = winner.id === image1.id ? image2 : image1;
    const scoreDifference = (winner.analysis.averageScore - loser.analysis.averageScore).toFixed(1);
    
    const title = `🏆 ${winner.userName}님 승리! - 얼평대결`;
    
    // 최종 판결 내용을 포함한 설명 생성
    const battleResultText = battle.resultText || '';
    const shortJudgment = battleResultText.length > 100 
      ? battleResultText.substring(0, 100) + '...' 
      : battleResultText;
    
    const description = `${winner.userName}님이 ${loser.userName}님을 ${scoreDifference}점 차이로 이겼습니다!\n\n📜 최종 판결: ${shortJudgment}`;
    
    // 첫 번째 참가자(사용자가 입력한 이미지)를 Open Graph 이미지로 사용
    const ogImage = image1.imageUrl;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 800,
            height: 600,
            alt: `${winner.userName}님의 승리 이미지`,
          },
        ],
        type: 'website',
        siteName: '얼평대결',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
      // 카카오톡 공유를 위한 추가 메타 태그
      other: {
        'og:image:width': '800',
        'og:image:height': '600',
        'og:locale': 'ko_KR',
        // 카카오톡에서 더 잘 인식되도록 추가 속성
        'kakao:title': title,
        'kakao:description': description,
        'kakao:image': ogImage,
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 중 오류:', error);
    return {
      title: '얼평대결 - 배틀 결과',
      description: 'AI가 평가하는 얼굴 대결 결과를 확인해보세요!',
    };
  }
}

export default async function SharedBattleResultPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <SharedBattleResultClient battleId={resolvedParams.id} />;
} 