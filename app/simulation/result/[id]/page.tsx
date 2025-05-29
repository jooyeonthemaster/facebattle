import { Metadata } from 'next';
import { getSimulationBattleResult, getMultiSimulationResult } from '@/src/lib/firebaseService';
import SharedSimulationResultClient from './SharedSimulationResultClient';

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
    // 먼저 다중 시뮬레이션 결과를 확인
    const multiResult = await getMultiSimulationResult(battleId);
    
    if (multiResult) {
      // 다중 인원 시뮬레이션 메타데이터
      const { battle, participants, winner } = multiResult;
      const participantCount = battle.participantCount;
      
      let title: string;
      let description: string;
      
      if (participantCount === 1) {
        // 솔로 분석
        title = `🔬 ${winner.userName}님의 개인 분석 결과`;
        description = `${winner.userName}님의 상세한 AI 분석 결과를 확인해보세요!\n평균 점수: ${winner.analysis.averageScore.toFixed(1)}점`;
      } else {
        // 다중 참가자 대결
        const sortedParticipants = participants.sort((a, b) => a.rank - b.rank);
        title = `🏆 ${participantCount}명 시뮬레이션 - ${winner.userName}님 1위!`;
        
        const rankings = sortedParticipants.slice(0, 3).map((p, idx) => 
          `${idx + 1}위: ${p.userName} (${p.analysis.averageScore.toFixed(1)}점)`
        ).join('\n');
        
        description = `${participantCount}명이 참가한 치열한 AI 대결!\n\n🏅 순위:\n${rankings}`;
      }
      
      // 승자의 이미지를 Open Graph 이미지로 사용
      const ogImage = winner.imageUrl;
      
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
              alt: `${winner.userName}님의 결과 이미지`,
            },
          ],
          type: 'website',
          siteName: '얼굴대결 - 시뮬레이션',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [ogImage],
        },
        other: {
          'og:image:width': '800',
          'og:image:height': '600',
          'og:locale': 'ko_KR',
          'kakao:title': title,
          'kakao:description': description,
          'kakao:image': ogImage,
        },
      };
    }
    
    // 기존 2명 시뮬레이션 결과 확인
    const battleResult = await getSimulationBattleResult(battleId);
    
    if (!battleResult) {
      return {
        title: '시뮬레이션 대결 - 결과를 찾을 수 없습니다',
        description: '요청하신 시뮬레이션 결과를 찾을 수 없습니다.',
      };
    }
    
    const { winner, image1, image2, battle } = battleResult;
    const loser = winner.id === image1.id ? image2 : image1;
    const scoreDifference = (winner.analysis.averageScore - loser.analysis.averageScore).toFixed(1);
    
    const title = `🔬 ${winner.userName}님 승리! - 시뮬레이션 대결`;
    
    // 최종 판결 내용을 포함한 설명 생성
    const battleResultText = battle.resultText || '';
    const shortJudgment = battleResultText.length > 100 
      ? battleResultText.substring(0, 100) + '...' 
      : battleResultText;
    
    const description = `${winner.userName}님이 ${loser.userName}님을 ${scoreDifference}점 차이로 이겼습니다!\n\n📜 최종 판결: ${shortJudgment}`;
    
    // 첫 번째 참가자 이미지를 Open Graph 이미지로 사용
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
        siteName: '얼굴대결 - 시뮬레이션',
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
    console.error('시뮬레이션 메타데이터 생성 중 오류:', error);
    return {
      title: '시뮬레이션 대결 - 결과',
      description: 'AI 시뮬레이션 대결 결과를 확인해보세요!',
    };
  }
}

export default async function SharedSimulationResultPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <SharedSimulationResultClient battleId={resolvedParams.id} />;
} 