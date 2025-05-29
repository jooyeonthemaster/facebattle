'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/components/Header';
import BattleAnalysisResult from '@/src/components/BattleAnalysisResult';
import { getSimulationBattleResult, getMultiSimulationResult } from '@/src/lib/firebaseService';
import type { BattleResult } from '@/src/types';

// 타입 정의
interface TwoBattleData {
  id: string;
  participant1: {
    id: string;
    userName: string;
    imageUrl: string;
    analysis: {
      goldenRatio: number;
      goldenRatioDesc: string;
      facialFeatures: number;
      facialFeaturesDesc: string;
      skinTexture: number;
      skinTextureDesc: string;
      impressiveness: number;
      impressivenessDesc: string;
      growingCharm: number;
      growingCharmDesc: string;
      averageScore: number;
      persona: string;
      description: string;
    };
    gender: string;
  };
  participant2: {
    id: string;
    userName: string;
    imageUrl: string;
    analysis: {
      goldenRatio: number;
      goldenRatioDesc: string;
      facialFeatures: number;
      facialFeaturesDesc: string;
      skinTexture: number;
      skinTextureDesc: string;
      impressiveness: number;
      impressivenessDesc: string;
      growingCharm: number;
      growingCharmDesc: string;
      averageScore: number;
      persona: string;
      description: string;
    };
    gender: string;
  };
  winnerId: string;
  rawAnalysisResult: string;
  createdAt: any;
}

interface MultiBattleData {
  id: string;
  participants: Array<{
    id: string;
    userName: string;
    imageUrl: string;
    analysis: {
      goldenRatio: number;
      goldenRatioDesc: string;
      facialFeatures: number;
      facialFeaturesDesc: string;
      skinTexture: number;
      skinTextureDesc: string;
      impressiveness: number;
      impressivenessDesc: string;
      growingCharm: number;
      growingCharmDesc: string;
      averageScore: number;
      persona: string;
      description: string;
      rank: number;
    };
    gender: string;
  }>;
  rawAnalysisResult: string;
  verdict: string;
  createdAt: any;
}

export default function SharedSimulationResultClient({ id }: { id: string }) {
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error'>('loading');
  const [battleData, setBattleData] = useState<TwoBattleData | null>(null);
  const [multiData, setMultiData] = useState<MultiBattleData | null>(null);
  const [expandedParticipants, setExpandedParticipants] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBattleResult();
  }, [id]);

  const loadBattleResult = async () => {
    try {
      setLoadingState('loading');
      
      // 먼저 2명 시뮬레이션 결과 확인
      const twoBattleResult = await getSimulationBattleResult(id);
      if (twoBattleResult) {
        setBattleData(twoBattleResult as unknown as TwoBattleData);
        setLoadingState('success');
        return;
      }

      // 다중 참가자 시뮬레이션 결과 확인
      const multiBattleResult = await getMultiSimulationResult(id);
      if (multiBattleResult) {
        setMultiData(multiBattleResult as unknown as MultiBattleData);
        setLoadingState('success');
        return;
      }

      // 둘 다 없으면 에러
      setLoadingState('error');
    } catch (error) {
      console.error('결과 로딩 중 오류:', error);
      setLoadingState('error');
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'FaceBattle 시뮬레이션 결과',
          text: '내 시뮬레이션 결과를 확인해보세요!',
          url: window.location.href,
        });
      } catch (error) {
        // 공유 실패 시 URL 복사로 대체
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('링크가 클립보드에 복사되었습니다!');
      }).catch(() => {
        alert('링크 복사에 실패했습니다.');
      });
    } else {
      alert('브라우저에서 지원하지 않는 기능입니다.');
    }
  };

  const toggleParticipantDetails = (participantId: string) => {
    const newExpanded = new Set(expandedParticipants);
    if (newExpanded.has(participantId)) {
      newExpanded.delete(participantId);
    } else {
      newExpanded.add(participantId);
    }
    setExpandedParticipants(newExpanded);
  };

  if (loadingState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full animate-spin">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full absolute -top-1.5 left-1/2 transform -translate-x-1/2"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl animate-pulse">🔍</div>
                </div>
              </div>
              <p className="text-purple-200">결과를 불러오는 중...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loadingState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-red-300 mb-4">❌ 결과를 찾을 수 없습니다</h2>
              <p className="text-red-200 mb-6">요청하신 시뮬레이션 결과가 존재하지 않거나 삭제되었습니다.</p>
              <button
                onClick={() => router.push('/simulation')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                새 시뮬레이션 시작
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 2명 기존 대결 결과 표시
  if (battleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-4">
              ⚔️ 1 vs 1 대결 결과
            </h1>
            <p className="text-purple-200 text-lg">치열한 양자 대결의 최종 결과입니다!</p>
            <p className="text-purple-300 text-sm mt-2">
              ※ 시뮬레이션 결과는 랭킹에 영향을 주지 않습니다.
            </p>
          </div>

          <BattleAnalysisResult 
            currentImage={{
              id: battleData.participant1.id,
              userName: battleData.participant1.userName,
              imageUrl: battleData.participant1.imageUrl,
              analysis: battleData.participant1.analysis,
              gender: battleData.participant1.gender as 'male' | 'female' | 'unknown',
              userID: battleData.participant1.id,
              createdAt: battleData.createdAt,
              battleCount: 0,
              winCount: 0,
              lossCount: 0
            }}
            opponentImage={{
              id: battleData.participant2.id,
              userName: battleData.participant2.userName,
              imageUrl: battleData.participant2.imageUrl,
              analysis: battleData.participant2.analysis,
              gender: battleData.participant2.gender as 'male' | 'female' | 'unknown',
              userID: battleData.participant2.id,
              createdAt: battleData.createdAt,
              battleCount: 0,
              winCount: 0,
              lossCount: 0
            }}
            winnerImage={battleData.winnerId === battleData.participant1.id ? {
              id: battleData.participant1.id,
              userName: battleData.participant1.userName,
              imageUrl: battleData.participant1.imageUrl,
              analysis: battleData.participant1.analysis,
              gender: battleData.participant1.gender as 'male' | 'female' | 'unknown',
              userID: battleData.participant1.id,
              createdAt: battleData.createdAt,
              battleCount: 0,
              winCount: 0,
              lossCount: 0
            } : {
              id: battleData.participant2.id,
              userName: battleData.participant2.userName,
              imageUrl: battleData.participant2.imageUrl,
              analysis: battleData.participant2.analysis,
              gender: battleData.participant2.gender as 'male' | 'female' | 'unknown',
              userID: battleData.participant2.id,
              createdAt: battleData.createdAt,
              battleCount: 0,
              winCount: 0,
              lossCount: 0
            }}
            analysisText={battleData.rawAnalysisResult}
          />

          <div className="text-center mt-8 space-y-4">
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                📤 결과 공유하기
              </button>
              <button
                onClick={() => router.push('/simulation')}
                className="px-6 py-3 bg-purple-700/50 hover:bg-purple-600/50 text-white font-bold rounded-xl transition-all"
              >
                🔄 새 시뮬레이션
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 다중 참가자 결과 (1명, 3-4명)
  if (multiData && multiData.participants) {
    const participantCount = multiData.participants.length;
    const sortedParticipants = [...multiData.participants].sort((a, b) => a.analysis.rank - b.analysis.rank);
    
    // 인원수별 타이틀과 설명
    let titleIcon = '';
    let titleText = '';
    let descriptionText = '';
    
    if (participantCount === 1) {
      titleIcon = '🔍';
      titleText = '개인 심화 분석 결과';
      descriptionText = '당신만의 특별한 매력을 깊이 있게 분석했습니다!';
    } else if (participantCount === 3) {
      titleIcon = '🏆';
      titleText = '트리플 매치 결과';
      descriptionText = '3명의 치열한 삼파전 대결이 끝났습니다!';
    } else if (participantCount === 4) {
      titleIcon = '👑';
      titleText = '쿼드러플 배틀 결과';
      descriptionText = '4명의 대규모 토너먼트 배틀 결과입니다!';
    } else {
      titleIcon = '🎯';
      titleText = `${participantCount}명 시뮬레이션 결과`;
      descriptionText = `${participantCount}명의 특별한 대결이 끝났습니다!`;
    }

    // 메달 및 순위 아이콘
    const getRankIcon = (rank: number, totalCount: number) => {
      if (totalCount === 1) return '⭐';
      if (rank === 1) return '🥇';
      if (rank === 2) return '🥈';
      if (rank === 3) return '🥉';
      return '🏅';
    };

    const getRankTitle = (rank: number, totalCount: number) => {
      if (totalCount === 1) return '분석 결과';
      if (rank === 1) return '🎉 챔피언';
      if (rank === 2) return '✨ 준우승';
      if (rank === 3) return '💫 3위';
      if (rank === 4) return '🌟 4위';
      return `${rank}위`;
    };

    const getRankBgColor = (rank: number, totalCount: number) => {
      if (totalCount === 1) return 'from-purple-600 to-indigo-600';
      if (rank === 1) return 'from-yellow-500 to-orange-500';
      if (rank === 2) return 'from-gray-400 to-gray-500';
      if (rank === 3) return 'from-amber-600 to-yellow-600';
      return 'from-purple-500 to-blue-500';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-4">
              {titleIcon} {titleText}
            </h1>
            <p className="text-purple-200 text-lg">{descriptionText}</p>
            <p className="text-purple-300 text-sm mt-2">
              ※ 시뮬레이션 결과는 랭킹에 영향을 주지 않습니다.
            </p>
          </div>

          {/* 1명 개인 분석 레이아웃 */}
          {participantCount === 1 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 mb-8">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={sortedParticipants[0].imageUrl}
                      alt={sortedParticipants[0].userName}
                      className="w-32 h-32 object-cover rounded-full border-4 border-purple-400 mx-auto"
                    />
                    <div className="absolute -top-2 -right-2 text-4xl animate-pulse">⭐</div>
                  </div>
                  <h2 className="text-2xl font-bold text-purple-200 mt-4">{sortedParticipants[0].userName}</h2>
                  <p className="text-purple-300 text-lg">개인 심화 분석 완료</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <div className="text-yellow-300 font-bold mb-2">💫 황금비율</div>
                    <div className="text-white text-xl font-bold">{sortedParticipants[0].analysis.goldenRatio.toFixed(1)}점</div>
                    <div className="text-purple-200 text-sm mt-1">{sortedParticipants[0].analysis.goldenRatioDesc}</div>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <div className="text-pink-300 font-bold mb-2">👁️ 이목구비</div>
                    <div className="text-white text-xl font-bold">{sortedParticipants[0].analysis.facialFeatures.toFixed(1)}점</div>
                    <div className="text-purple-200 text-sm mt-1">{sortedParticipants[0].analysis.facialFeaturesDesc}</div>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <div className="text-green-300 font-bold mb-2">✨ 피부텍스처</div>
                    <div className="text-white text-xl font-bold">{sortedParticipants[0].analysis.skinTexture.toFixed(1)}점</div>
                    <div className="text-purple-200 text-sm mt-1">{sortedParticipants[0].analysis.skinTextureDesc}</div>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <div className="text-blue-300 font-bold mb-2">🌟 분위기</div>
                    <div className="text-white text-xl font-bold">{sortedParticipants[0].analysis.impressiveness.toFixed(1)}점</div>
                    <div className="text-purple-200 text-sm mt-1">{sortedParticipants[0].analysis.impressivenessDesc}</div>
                  </div>
                </div>

                <div className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6">
                  <div className="text-white text-3xl font-bold mb-2">
                    총점: {sortedParticipants[0].analysis.averageScore.toFixed(1)}점
                  </div>
                  <div className="text-purple-200 text-lg mb-4">
                    페르소나: {sortedParticipants[0].analysis.persona}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3-4명 순위 기반 레이아웃 */}
          {participantCount >= 3 && (
            <div className="max-w-6xl mx-auto">
              {/* 순위별 카드 */}
              <div className={`grid gap-6 ${
                participantCount === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              }`}>
                {sortedParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all hover:scale-105 ${
                      participant.analysis.rank === 1 
                        ? 'border-yellow-400/70 shadow-yellow-400/20 shadow-lg' 
                        : participant.analysis.rank === 2
                        ? 'border-gray-400/70 shadow-gray-400/20 shadow-lg'
                        : participant.analysis.rank === 3
                        ? 'border-amber-500/70 shadow-amber-500/20 shadow-lg'
                        : 'border-purple-400/50'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="relative inline-block">
                        <img
                          src={participant.imageUrl}
                          alt={participant.userName}
                          className={`w-24 h-24 object-cover rounded-full border-4 mx-auto ${
                            participant.analysis.rank === 1 ? 'border-yellow-400' :
                            participant.analysis.rank === 2 ? 'border-gray-400' :
                            participant.analysis.rank === 3 ? 'border-amber-500' :
                            'border-purple-400'
                          }`}
                        />
                        <div className="absolute -top-2 -right-2 text-3xl">
                          {getRankIcon(participant.analysis.rank, participantCount)}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-3">{participant.userName}</h3>
                      <div className={`inline-block px-4 py-2 rounded-full text-white font-bold text-sm mt-2 bg-gradient-to-r ${getRankBgColor(participant.analysis.rank, participantCount)}`}>
                        {getRankTitle(participant.analysis.rank, participantCount)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-purple-800/30 rounded-lg p-3">
                        <div className="text-yellow-300 font-bold text-sm">💫 황금비율</div>
                        <div className="text-white font-bold">{participant.analysis.goldenRatio.toFixed(1)}점</div>
                        {expandedParticipants.has(participant.id) && participant.analysis.goldenRatioDesc && (
                          <div className="text-purple-200 text-xs mt-1">{participant.analysis.goldenRatioDesc}</div>
                        )}
                      </div>
                      <div className="bg-purple-800/30 rounded-lg p-3">
                        <div className="text-pink-300 font-bold text-sm">👁️ 이목구비</div>
                        <div className="text-white font-bold">{participant.analysis.facialFeatures.toFixed(1)}점</div>
                        {expandedParticipants.has(participant.id) && participant.analysis.facialFeaturesDesc && (
                          <div className="text-purple-200 text-xs mt-1">{participant.analysis.facialFeaturesDesc}</div>
                        )}
                      </div>
                      <div className="bg-purple-800/30 rounded-lg p-3">
                        <div className="text-green-300 font-bold text-sm">✨ 피부</div>
                        <div className="text-white font-bold">{participant.analysis.skinTexture.toFixed(1)}점</div>
                        {expandedParticipants.has(participant.id) && participant.analysis.skinTextureDesc && (
                          <div className="text-purple-200 text-xs mt-1">{participant.analysis.skinTextureDesc}</div>
                        )}
                      </div>
                      <div className="bg-purple-800/30 rounded-lg p-3">
                        <div className="text-blue-300 font-bold text-sm">🌟 분위기</div>
                        <div className="text-white font-bold">{participant.analysis.impressiveness.toFixed(1)}점</div>
                        {expandedParticipants.has(participant.id) && participant.analysis.impressivenessDesc && (
                          <div className="text-purple-200 text-xs mt-1">{participant.analysis.impressivenessDesc}</div>
                        )}
                      </div>
                      <div className="bg-purple-800/30 rounded-lg p-3">
                        <div className="text-red-300 font-bold text-sm">💖 볼매지수</div>
                        <div className="text-white font-bold">{participant.analysis.growingCharm.toFixed(1)}점</div>
                        {expandedParticipants.has(participant.id) && participant.analysis.growingCharmDesc && (
                          <div className="text-purple-200 text-xs mt-1">{participant.analysis.growingCharmDesc}</div>
                        )}
                      </div>
                    </div>

                    {/* 상세 정보 토글 버튼 */}
                    <button
                      onClick={() => toggleParticipantDetails(participant.id)}
                      className="w-full mt-3 py-2 px-4 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-purple-200 text-sm transition-all"
                    >
                      {expandedParticipants.has(participant.id) ? '📤 상세정보 숨기기' : '📥 상세정보 보기'}
                    </button>

                    <div className={`text-center mt-4 p-4 rounded-xl bg-gradient-to-r ${getRankBgColor(participant.analysis.rank, participantCount)}`}>
                      <div className="text-white text-xl font-bold">
                        평균: {participant.analysis.averageScore.toFixed(1)}점
                      </div>
                      <div className="text-white/90 text-sm mt-1">
                        {participant.analysis.persona}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 종합 판정 - 마법의 거울 스타일 적용 */}
          {multiData.verdict && (
            <div className="max-w-4xl mx-auto mt-8">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-400/50">
                <h3 className="text-xl font-serif text-yellow-300 mb-4 text-center">
                  🔮 마법의 거울 최종 판정
                </h3>
                <div className="bg-purple-800/50 rounded-lg p-4">
                  <p className="text-purple-100 leading-relaxed text-center whitespace-pre-wrap">
                    {multiData.verdict}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="text-center mt-8 space-y-4">
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                📤 결과 공유하기
              </button>
              <button
                onClick={() => router.push('/simulation')}
                className="px-6 py-3 bg-purple-700/50 hover:bg-purple-600/50 text-white font-bold rounded-xl transition-all"
              >
                🔄 새 시뮬레이션
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
} 