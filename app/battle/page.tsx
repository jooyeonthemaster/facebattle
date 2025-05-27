'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/components/Header';
import BattleResult from '@/src/components/BattleResult';
import ImageAnalysisResult from '@/src/components/ImageAnalysisResult';
import { getRandomImageForBattle, saveBattleResult } from '@/src/lib/firebaseService';
import { compareImages } from '@/src/lib/gemini';
import { parseComparisonResult } from '@/src/lib/parseUtils';
import { useAppStore } from '@/src/lib/store';
import { Image as ImageType } from '@/src/types';

export default function BattlePage() {
  const router = useRouter();
  const { currentImage } = useAppStore();
  const [opponentImage, setOpponentImage] = useState<ImageType | null>(null);
  const [winnerImage, setWinnerImage] = useState<ImageType | null>(null);
  const [resultText, setResultText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
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
    // 현재 이미지가 없으면 홈 페이지로 리다이렉트
    if (!currentImage) {
      router.push('/');
      return;
    }
    
    const startBattle = async () => {
      try {
        setIsLoading(true);
        
        // 랜덤 대결 상대 이미지 가져오기 (같은 성별끼리만)
        const opponent = await getRandomImageForBattle(currentImage.id, currentImage.gender);
        
        if (!opponent) {
          setError('대결할 상대를 찾을 수 없습니다. 다른 사용자가 이미지를 업로드하면 대결이 가능합니다.');
          setIsLoading(false);
          return;
        }
        
        setOpponentImage(opponent);
        
        // 약간의 지연 후 분석 시작 (드라마틱한 효과)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 두 이미지 비교 분석
        const result = await compareImages(
          await fetch(currentImage.imageUrl).then(res => res.blob()).then(blob => new File([blob], 'image1.jpg', { type: 'image/jpeg' })),
          await fetch(opponent.imageUrl).then(res => res.blob()).then(blob => new File([blob], 'image2.jpg', { type: 'image/jpeg' }))
        );
        
        // 비교 결과 파싱
        const parsedResult = parseComparisonResult(result);
        
        // 현재 이미지와 상대방 이미지의 분석 결과 업데이트
        const updatedCurrentImage = {
          ...currentImage,
          analysis: {
            ...currentImage.analysis,
            ...parsedResult.image1Analysis
          }
        };
        
        const updatedOpponentImage = {
          ...opponent,
          analysis: {
            ...opponent.analysis,
            ...parsedResult.image2Analysis
          }
        };
        
        // 평균 점수를 기준으로 승자 결정 (API의 최종 승자 결정은 무시)
        let winner;
        if (updatedCurrentImage.analysis.averageScore >= updatedOpponentImage.analysis.averageScore) {
          winner = updatedCurrentImage;
        } else {
          winner = updatedOpponentImage;
        }
        
        setResultText(result);
        setOpponentImage(updatedOpponentImage);
        setWinnerImage(winner);
        
        // 배틀 결과 저장
        await saveBattleResult(
          currentImage.id,
          opponent.id,
          winner.id,
          result
        );
        
        // 결과를 드라마틱하게 표시
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowResults(true);
      } catch (err) {
        console.error('배틀 중 오류:', err);
        setError('배틀 진행 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };
    
    startBattle();
  }, [currentImage, router]);
  
  // 새로운 대결 시작
  const handleNewBattle = () => {
    router.push('/');
  };
  
  // 랭킹 페이지로 이동
  const handleViewRanking = () => {
    router.push('/ranking');
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Header />
        <div className="flex items-center justify-center px-4 sm:px-6 py-20">
          <div className="max-w-lg w-full bg-purple-900/50 backdrop-blur-sm border-2 border-red-400/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="text-4xl sm:text-5xl mb-4">⚠️</div>
            <h1 className="text-xl sm:text-2xl font-serif text-red-300 mb-4">마법의 거울에 문제가 생겼습니다</h1>
            <p className="text-purple-200 mb-6 text-sm sm:text-base">{error}</p>
            <button
              onClick={handleNewBattle}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-serif transform hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
            >
              처음부터 다시 도전하기
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
          ⚔️ 아름다움의 결투장 ⚔️
        </h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="relative mb-6 sm:mb-8">
              {/* 마법의 거울 로딩 애니메이션 - 모바일 최적화 */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full p-2 animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-300 rounded-full flex items-center justify-center">
                  <div className="text-4xl sm:text-6xl animate-spin">✨</div>
                </div>
              </div>
            </div>
            
            {!opponentImage ? (
              <div className="text-center px-4">
                <p className="text-lg sm:text-2xl font-serif text-purple-200 mb-2 animate-pulse">
                  마법의 거울이 도전자를 찾고 있습니다...
                </p>
                <p className="text-purple-300 text-sm sm:text-base">운명의 상대를 소환하는 중</p>
              </div>
            ) : (
              <div className="text-center px-4">
                <p className="text-lg sm:text-2xl font-serif text-purple-200 mb-2 animate-pulse">
                  거울이 두 도전자를 비교하고 있습니다...
                </p>
                <p className="text-purple-300 text-sm sm:text-base">진정한 아름다움을 판별하는 중</p>
              </div>
            )}
          </div>
        ) : showResults ? (
          <div className="space-y-6 sm:space-y-8">
            {/* 대결 결과 */}
            {currentImage && opponentImage && winnerImage && (
              <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-400/30 shadow-2xl">
                <h2 className="text-xl sm:text-2xl font-serif text-center mb-4 sm:mb-6 text-purple-100">
                  🏆 대결 결과 🏆
                </h2>
                
                {/* 대결자들 - 모바일 최적화 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {/* 현재 사용자 */}
                  <div className={`
                    bg-purple-800/30 rounded-xl p-4 sm:p-6 border-2 transition-all duration-300
                    ${winnerImage?.id === currentImage.id ? 'border-yellow-400 bg-yellow-500/10' : 'border-purple-400/50'}
                  `}>
                    <div className="text-center">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 relative overflow-hidden rounded-full border-4 border-purple-400">
                        <img 
                          src={currentImage.imageUrl} 
                          alt={currentImage.userName} 
                          className="w-full h-full object-cover"
                        />
                        {winnerImage?.id === currentImage.id && (
                          <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                            <div className="text-2xl sm:text-3xl">👑</div>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif text-purple-100 mb-2">{currentImage.userName}</h3>
                      <p className="text-sm text-purple-300 mb-2">평균 점수: {currentImage.analysis.averageScore.toFixed(1)}점</p>
                      {winnerImage?.id === currentImage.id && (
                        <div className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-300 text-sm font-bold">
                          🏆 승리!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 상대방 */}
                  <div className={`
                    bg-purple-800/30 rounded-xl p-4 sm:p-6 border-2 transition-all duration-300
                    ${winnerImage?.id === opponentImage.id ? 'border-yellow-400 bg-yellow-500/10' : 'border-purple-400/50'}
                  `}>
                    <div className="text-center">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 relative overflow-hidden rounded-full border-4 border-purple-400">
                        <img 
                          src={opponentImage.imageUrl} 
                          alt={opponentImage.userName} 
                          className="w-full h-full object-cover"
                        />
                        {winnerImage?.id === opponentImage.id && (
                          <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                            <div className="text-2xl sm:text-3xl">👑</div>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif text-purple-100 mb-2">{opponentImage.userName}</h3>
                      <p className="text-sm text-purple-300 mb-2">평균 점수: {opponentImage.analysis.averageScore.toFixed(1)}점</p>
                      {winnerImage?.id === opponentImage.id && (
                        <div className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-300 text-sm font-bold">
                          🏆 승리!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 분석 결과 */}
                <div className="bg-purple-800/50 rounded-xl p-4 sm:p-6 mb-6">
                  <h3 className="text-lg sm:text-xl font-serif text-yellow-300 mb-4 text-center">
                    🔮 마법의 거울의 판정 🔮
                  </h3>
                  <ImageAnalysisResult analysis={winnerImage.analysis} />
                </div>

                {/* 액션 버튼들 - 모바일 최적화 */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={handleNewBattle}
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-serif rounded-lg sm:rounded-xl transform hover:scale-105 active:scale-95 transition-all shadow-lg text-sm sm:text-base"
                  >
                    🔄 새로운 대결
                  </button>
                  
                  <button
                    onClick={handleViewRanking}
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-serif rounded-lg sm:rounded-xl transform hover:scale-105 active:scale-95 transition-all shadow-lg text-sm sm:text-base"
                  >
                    🏆 랭킹 보기
                  </button>
                </div>
              </div>
            )}
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