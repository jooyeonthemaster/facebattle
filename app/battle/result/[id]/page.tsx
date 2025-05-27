'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/src/components/Header';
import BattleAnalysisResult from '@/src/components/BattleAnalysisResult';
import { getBattleResult } from '@/src/lib/firebaseService';
import { Image as ImageType, Battle } from '@/src/types';

export default function SharedBattleResultPage() {
  const params = useParams();
  const router = useRouter();
  const battleId = params.id as string;
  
  const [battleData, setBattleData] = useState<{
    battle: Battle;
    image1: ImageType;
    image2: ImageType;
    winner: ImageType;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stars, setStars] = useState<Array<{width: number, height: number, left: number, top: number, delay: number, duration: number}>>([]);
  
  useEffect(() => {
    // 별 데이터를 클라이언트 사이드에서만 생성
    const starArray = [...Array(30)].map(() => ({
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2
    }));
    setStars(starArray);
  }, []);
  
  useEffect(() => {
    const loadBattleResult = async () => {
      if (!battleId) {
        setError('잘못된 배틀 ID입니다.');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const result = await getBattleResult(battleId);
        
        if (!result) {
          setError('배틀 결과를 찾을 수 없습니다.');
          setIsLoading(false);
          return;
        }
        
        setBattleData(result);
      } catch (err) {
        console.error('배틀 결과 로딩 중 오류:', err);
        setError('배틀 결과를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBattleResult();
  }, [battleId]);
  
  const handleNewBattle = () => {
    router.push('/');
  };
  
  const handleViewRanking = () => {
    router.push('/ranking');
  };
  
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '얼평대결 - 배틀 결과',
          text: `${battleData?.winner.userName}님이 승리했습니다!`,
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
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Header />
        <div className="flex items-center justify-center px-4 sm:px-6 py-20">
          <div className="max-w-lg w-full bg-purple-900/50 backdrop-blur-sm border-2 border-red-400/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="text-4xl sm:text-5xl mb-4">⚠️</div>
            <h1 className="text-xl sm:text-2xl font-serif text-red-300 mb-4">배틀 결과를 찾을 수 없습니다</h1>
            <p className="text-purple-200 mb-6 text-sm sm:text-base">{error}</p>
            <button
              onClick={handleNewBattle}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-serif transform hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
            >
              새로운 대결 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Header />
      
      {/* 배경 별 효과 */}
      <div className="fixed inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-70"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              animation: `twinkle ${star.duration}s infinite ${star.delay}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-6 sm:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
          ⚔️ 배틀 결과 공유 ⚔️
        </h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="relative mb-6 sm:mb-8">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full p-2 animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-300 rounded-full flex items-center justify-center">
                  <div className="text-4xl sm:text-6xl animate-spin">✨</div>
                </div>
              </div>
            </div>
            
            <div className="text-center px-4">
              <p className="text-lg sm:text-2xl font-serif text-purple-200 mb-2 animate-pulse">
                배틀 결과를 불러오는 중...
              </p>
              <p className="text-purple-300 text-sm sm:text-base">잠시만 기다려주세요</p>
            </div>
          </div>
        ) : battleData ? (
          <div className="space-y-6 sm:space-y-8">
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
                {new Date(battleData.battle.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* 배틀 분석 결과 */}
            <BattleAnalysisResult
              currentImage={battleData.image1}
              opponentImage={battleData.image2}
              winnerImage={battleData.winner}
              analysisText={battleData.battle.resultText}
            />

            {/* 액션 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleShare}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-serif rounded-xl transform hover:scale-105 active:scale-95 transition-all shadow-lg text-base sm:text-lg"
              >
                📤 결과 공유하기
              </button>
              
              <button
                onClick={handleNewBattle}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-serif rounded-xl transform hover:scale-105 active:scale-95 transition-all shadow-lg text-base sm:text-lg"
              >
                🔄 새로운 대결
              </button>
              
              <button
                onClick={handleViewRanking}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-serif rounded-xl transform hover:scale-105 active:scale-95 transition-all shadow-lg text-base sm:text-lg"
              >
                🏆 랭킹 보기
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 