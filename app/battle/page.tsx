'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    const starArray = [...Array(50)].map(() => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2
    }));
    setStars(starArray);
  }, []);
  
  useEffect(() => {
    // 현재 이미지가 없으면 업로드 페이지로 리다이렉트
    if (!currentImage) {
      router.push('/upload');
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
    router.push('/upload');
  };
  
  // 랭킹 페이지로 이동
  const handleViewRanking = () => {
    router.push('/ranking');
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-purple-900/50 backdrop-blur-sm border-2 border-red-400/50 rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-serif text-red-300 mb-4">마법의 거울에 문제가 생겼습니다</h1>
          <p className="text-purple-200 mb-6">{error}</p>
          <button
            onClick={handleNewBattle}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-serif transform hover:scale-105 transition-all"
          >
            처음부터 다시 도전하기
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
          ⚔️ 아름다움의 결투장 ⚔️
        </h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              {/* 마법의 거울 로딩 애니메이션 */}
              <div className="w-40 h-40 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full p-2 animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-300 rounded-full flex items-center justify-center">
                  <div className="text-6xl animate-spin">✨</div>
                </div>
              </div>
            </div>
            
            {!opponentImage ? (
              <div className="text-center">
                <p className="text-2xl font-serif text-purple-200 mb-2 animate-pulse">
                  마법의 거울이 도전자를 찾고 있습니다...
                </p>
                <p className="text-purple-300">운명의 상대를 소환하는 중</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-2xl font-serif text-purple-200 mb-2 animate-pulse">
                  거울이 두 도전자를 비교하고 있습니다...
                </p>
                <p className="text-purple-300">진정한 아름다움을 판별하는 중</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {currentImage && opponentImage && winnerImage && (
              <div className="space-y-10">
                {/* 대결 이미지 표시 */}
                {!showResults ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* 내 이미지 */}
                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 transform hover:scale-105 transition-all duration-300">
                      <h3 className="text-xl font-serif text-center mb-4 text-purple-100">
                        {currentImage.gender === 'male' ? '🤴 왕자님' : '👸 공주님'}
                      </h3>
                      <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl">
                        <img 
                          src={currentImage.imageUrl} 
                          alt="내 이미지" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-center mt-4 text-purple-200 text-sm">당신</p>
                    </div>
                    
                    {/* VS 표시 */}
                    <div className="flex items-center justify-center md:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">
                      <div className="text-5xl font-bold text-yellow-300 animate-pulse">VS</div>
                    </div>
                    
                    {/* 상대 이미지 */}
                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 transform hover:scale-105 transition-all duration-300">
                      <h3 className="text-xl font-serif text-center mb-4 text-purple-100">
                        {opponentImage.gender === 'male' ? '🤴 도전자' : '👸 도전자'}
                      </h3>
                      <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-pink-400 shadow-xl">
                        <img 
                          src={opponentImage.imageUrl} 
                          alt="상대 이미지" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-center mt-4 text-purple-200 text-sm">도전자</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 배틀 결과 표시 */}
                    <div className="bg-purple-900/40 backdrop-blur-sm rounded-3xl p-8 border border-purple-400/30 shadow-2xl">
                      <BattleResult
                        image1={currentImage}
                        image2={opponentImage}
                        winner={winnerImage}
                        resultText={resultText}
                      />
                    </div>
                    
                    {/* 상세 분석 결과 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-serif text-center mb-4 text-purple-100 bg-purple-800/40 backdrop-blur-sm py-3 rounded-t-2xl border-b-2 border-yellow-400/50">
                          ✨ 내 마법 분석 ✨
                        </h3>
                        <div className="bg-purple-900/30 backdrop-blur-sm rounded-b-2xl p-6 border border-purple-400/30">
                          <ImageAnalysisResult analysis={currentImage.analysis} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-serif text-center mb-4 text-purple-100 bg-purple-800/40 backdrop-blur-sm py-3 rounded-t-2xl border-b-2 border-pink-400/50">
                          ✨ 도전자 마법 분석 ✨
                        </h3>
                        <div className="bg-purple-900/30 backdrop-blur-sm rounded-b-2xl p-6 border border-purple-400/30">
                          <ImageAnalysisResult analysis={opponentImage.analysis} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                      <button
                        onClick={handleNewBattle}
                        className="bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-serif text-xl transform hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
                      >
                        🔄 새로운 도전
                      </button>
                      
                      <button
                        onClick={handleViewRanking}
                        className="bg-purple-700/50 hover:bg-purple-700/70 text-purple-100 backdrop-blur-sm border border-purple-400/50 px-8 py-4 rounded-xl font-serif text-xl hover:border-purple-400 transition-all"
                      >
                        👑 명예의 전당
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
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