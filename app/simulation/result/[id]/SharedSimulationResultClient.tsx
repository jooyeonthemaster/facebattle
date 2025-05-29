'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/components/Header';
import BattleAnalysisResult from '@/src/components/BattleAnalysisResult';
import { getSimulationBattleResult, getMultiSimulationResult } from '@/src/lib/firebaseService';
import { Image as ImageType, Battle } from '@/src/types';

interface SharedSimulationResultClientProps {
  battleId: string;
}

// 2명 시뮬레이션 데이터 타입
interface TwoBattleData {
  battle: Battle;
  image1: ImageType;
  image2: ImageType;
  winner: ImageType;
  type: 'two';
}

// 다중 시뮬레이션 데이터 타입
interface MultiBattleData {
  battle: {
    id: string;
    participantCount: number;
    winnerId: string;
    winnerRank: number;
    resultText: string;
    verdict: string;
    createdAt: string;
    type: string;
  };
  participants: Array<{
    id: string;
    userName: string;
    imageUrl: string;
    analysis: any;
    gender: 'male' | 'female' | 'unknown';
    rank: number;
  }>;
  winner: any;
  type: 'multi';
}

type BattleData = TwoBattleData | MultiBattleData;

export default function SharedSimulationResultClient({ battleId }: SharedSimulationResultClientProps) {
  const router = useRouter();
  
  const [battleData, setBattleData] = useState<BattleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadBattleResult = async () => {
      if (!battleId) {
        setError('잘못된 시뮬레이션 ID입니다.');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // 먼저 다중 시뮬레이션 결과를 확인
        const multiResult = await getMultiSimulationResult(battleId);
        
        if (multiResult) {
          setBattleData({ ...multiResult, type: 'multi' });
          setIsLoading(false);
          return;
        }
        
        // 기존 2명 시뮬레이션 결과 확인
        const twoResult = await getSimulationBattleResult(battleId);
        
        if (twoResult) {
          setBattleData({ ...twoResult, type: 'two' });
          setIsLoading(false);
          return;
        }
        
        setError('시뮬레이션 결과를 찾을 수 없습니다.');
      } catch (err) {
        console.error('시뮬레이션 결과 로딩 중 오류:', err);
        setError('시뮬레이션 결과를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBattleResult();
  }, [battleId]);
  
  const handleNewSimulation = () => {
    router.push('/simulation');
  };
  
  const handleGoHome = () => {
    router.push('/');
  };
  
  const handleShare = async () => {
    const url = window.location.href;
    
    let shareTitle = '얼굴대결 - 시뮬레이션 결과';
    let shareText = '';
    
    if (battleData?.type === 'two') {
      shareText = `${battleData.winner.userName}님이 승리했습니다!`;
    } else if (battleData?.type === 'multi') {
      const participantCount = battleData.battle.participantCount;
      shareText = participantCount === 1 
        ? `${battleData.winner.userName}님의 개인 분석 결과!`
        : `${participantCount}명 시뮬레이션에서 ${battleData.winner.userName}님이 1위!`;
    }
    
    // Web Share API 시도
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: url,
        });
      } catch (err) {
        // 공유 취소 시 에러 무시
        if ((err as Error).name !== 'AbortError') {
          console.error('공유 중 오류:', err);
        }
      }
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      try {
        await navigator.clipboard.writeText(url);
        alert('링크가 클립보드에 복사되었습니다!');
      } catch (err) {
        console.error('클립보드 복사 중 오류:', err);
        // 클립보드 API도 지원하지 않는 경우 수동 복사 안내
        prompt('이 링크를 복사하세요:', url);
      }
    }
  };

  // 에러 UI
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Header />
        <div className="flex items-center justify-center px-4 sm:px-6 py-20">
          <div className="max-w-lg w-full bg-purple-900/50 backdrop-blur-sm border-2 border-red-400/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="text-4xl sm:text-5xl mb-4">⚠️</div>
            <h1 className="text-xl sm:text-2xl font-serif text-red-300 mb-4">시뮬레이션 결과를 찾을 수 없습니다</h1>
            <p className="text-purple-200 mb-6 text-sm sm:text-base">{error}</p>
            <button
              onClick={handleNewSimulation}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-serif transform hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
            >
              새로운 시뮬레이션 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Header />
      
      {/* 간단한 배경 패턴 */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-6 sm:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
          🔬 시뮬레이션 결과 공유 🔬
        </h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="relative mb-6 sm:mb-8">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full p-2 animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-300 rounded-full flex items-center justify-center">
                  <div className="text-4xl sm:text-6xl animate-spin">🔬</div>
                </div>
              </div>
            </div>
            
            <div className="text-center px-4">
              <p className="text-lg sm:text-2xl font-serif text-purple-200 mb-2 animate-pulse">
                시뮬레이션 결과를 불러오는 중...
              </p>
              <p className="text-purple-300 text-sm sm:text-base">잠시만 기다려주세요</p>
            </div>
          </div>
        ) : battleData ? (
          <div className="space-y-6 sm:space-y-8">
            {/* 다중 인원 결과 UI */}
            {battleData.type === 'multi' && (
              <>
                {/* 승자 발표 */}
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-yellow-400/50 shadow-2xl text-center">
                  <div className="text-4xl sm:text-5xl mb-4">
                    {battleData.battle.participantCount === 1 ? '🔍' : '🏆'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-yellow-300 mb-4">
                    {battleData.battle.participantCount === 1 
                      ? `${battleData.winner.userName}님의 개인 분석` 
                      : `1위: ${battleData.winner.userName}님`
                    }
                  </h2>
                  <p className="text-lg sm:text-xl text-purple-200">
                    평균 점수 {battleData.winner.analysis.averageScore.toFixed(1)}점
                    {battleData.battle.participantCount === 1 ? '' : '으로 1위!'}
                  </p>
                  <p className="text-sm text-purple-300 mt-2">
                    {battleData.battle.participantCount}명 시뮬레이션 - {new Date(battleData.battle.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="mt-4 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-sm text-blue-200">
                      ⚠️ 시뮬레이션 결과는 랭킹에 영향을 주지 않습니다
                    </p>
                  </div>
                </div>

                {/* 참가자별 상세 결과 */}
                <div className="grid gap-6">
                  {battleData.participants.map((participant, index) => (
                    <div key={participant.id} className={`
                      bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all
                      ${participant.rank === 1 
                        ? 'border-yellow-400/80 bg-gradient-to-r from-yellow-500/20 to-orange-500/20' 
                        : participant.rank === 2 
                        ? 'border-gray-300/60 bg-gradient-to-r from-gray-400/20 to-gray-500/20' 
                        : participant.rank === 3 
                        ? 'border-orange-400/60 bg-gradient-to-r from-orange-600/20 to-red-500/20'
                        : 'border-purple-400/40 bg-purple-700/20'
                      }
                    `}>
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* 순위 및 이미지 */}
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">
                            {participant.rank === 1 ? '🥇' : 
                             participant.rank === 2 ? '🥈' : 
                             participant.rank === 3 ? '🥉' : 
                             `${participant.rank}위`}
                          </div>
                          <img 
                            src={participant.imageUrl} 
                            alt={participant.userName}
                            className="w-24 h-24 object-cover rounded-full border-4 border-white/30"
                          />
                          <h3 className="text-xl font-bold text-white mt-3">{participant.userName}</h3>
                        </div>

                        {/* 분석 결과 */}
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-yellow-300">{participant.analysis.goldenRatio}</div>
                              <div className="text-xs text-purple-300">황금비율</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-300">{participant.analysis.facialFeatures}</div>
                              <div className="text-xs text-purple-300">이목구비</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-300">{participant.analysis.skinTexture}</div>
                              <div className="text-xs text-purple-300">피부</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-pink-300">{participant.analysis.impressiveness}</div>
                              <div className="text-xs text-purple-300">분위기</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-red-300">{participant.analysis.growingCharm}</div>
                              <div className="text-xs text-purple-300">볼매</div>
                            </div>
                          </div>
                          
                          <div className="bg-purple-800/30 rounded-lg p-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white mb-1">
                                {participant.analysis.averageScore.toFixed(1)}점
                              </div>
                              <div className="text-purple-300 text-sm">평균 점수</div>
                            </div>
                          </div>

                          {participant.analysis.persona && (
                            <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg p-3">
                              <div className="text-center text-purple-200 text-sm italic">
                                "{participant.analysis.persona}"
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 종합 판정 */}
                {battleData.battle.verdict && (
                  <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/40">
                    <h3 className="text-xl font-bold text-purple-200 mb-4 text-center">🏅 종합 판정</h3>
                    <div className="text-purple-100 leading-relaxed whitespace-pre-wrap bg-purple-800/30 rounded-lg p-4">
                      {battleData.battle.verdict}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 기존 2명 결과 UI */}
            {battleData.type === 'two' && (
              <>
                {/* 승자 발표 */}
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-yellow-400/50 shadow-2xl text-center">
                  <div className="text-4xl sm:text-5xl mb-4">🏆</div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-yellow-300 mb-4">
                    승자: {battleData.winner.userName}
                  </h2>
                  <p className="text-lg sm:text-xl text-purple-200">
                    평균 점수 {battleData.winner.analysis.averageScore.toFixed(1)}점으로 승리!
                  </p>
                  <p className="text-sm text-purple-300 mt-2">
                    시뮬레이션 - {new Date(battleData.battle.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="mt-4 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <p className="text-sm text-blue-200">
                      ⚠️ 시뮬레이션 결과는 랭킹에 영향을 주지 않습니다
                    </p>
                  </div>
                </div>

                {/* 배틀 분석 결과 */}
                <BattleAnalysisResult
                  currentImage={battleData.image1}
                  opponentImage={battleData.image2}
                  winnerImage={battleData.winner}
                  analysisText={battleData.battle.resultText}
                />
              </>
            )}

            {/* 공통 액션 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleShare}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-serif transform hover:scale-105 active:scale-95 transition-all"
              >
                📤 결과 공유하기
              </button>
              
              <button
                onClick={handleNewSimulation}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-serif transform hover:scale-105 active:scale-95 transition-all"
              >
                🔬 새 시뮬레이션
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-serif transform hover:scale-105 active:scale-95 transition-all"
              >
                🏠 홈으로
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 