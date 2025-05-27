'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/components/Header';
import { getTopRankedImages } from '@/src/lib/firebaseService';
import { Image as ImageType } from '@/src/types';

export default function RankingPage() {
  const router = useRouter();
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all');
  const [stars, setStars] = useState<Array<{width: number, height: number, left: number, top: number, delay: number, duration: number}>>([]);
  
  useEffect(() => {
    // 별 데이터를 클라이언트 사이드에서만 생성
    const starArray = [...Array(20)].map(() => ({
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
    const fetchRankingData = async () => {
      try {
        setIsLoading(true);
        // 성별에 따라 상위 랭킹 이미지 가져오기
        const genderFilter = selectedGender === 'all' ? undefined : selectedGender;
        const topImages = await getTopRankedImages(10, genderFilter);
        
        // 디버깅 정보 출력
        console.log('선택된 성별:', selectedGender);
        console.log('성별 필터:', genderFilter);
        console.log('가져온 이미지들:', topImages);
        console.log('이미지 개수:', topImages.length);
        
        setImages(topImages);
      } catch (err) {
        console.error('랭킹 데이터 가져오기 중 오류:', err);
        setError('랭킹 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRankingData();
  }, [selectedGender]);
  
  const getWinRate = (image: ImageType) => {
    if (image.battleCount === 0) return 0;
    return (image.winCount / image.battleCount) * 100;
  };
  
  const handleStartNewBattle = () => {
    router.push('/');
  };
  
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '👑';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}`;
    }
  };
  
  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'from-yellow-400 to-yellow-600';
      case 1: return 'from-gray-300 to-gray-500';
      case 2: return 'from-amber-400 to-amber-600';
      default: return 'from-purple-400 to-purple-600';
    }
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Header />
        <div className="flex items-center justify-center px-4 sm:px-6 py-20">
          <div className="max-w-lg w-full bg-purple-900/50 backdrop-blur-sm border-2 border-red-400/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="text-4xl sm:text-5xl mb-4">⚠️</div>
            <h1 className="text-xl sm:text-2xl font-serif text-red-300 mb-4">랭킹 데이터 오류</h1>
            <p className="text-purple-200 mb-6 text-sm sm:text-base">{error}</p>
            <button
              onClick={handleStartNewBattle}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-serif transform hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
            >
              새 대결 시작하기
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
        {/* 헤더 */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
            🏆 명예의 전당 🏆
          </h1>
          <p className="text-purple-200 text-sm sm:text-base">
            마법의 거울이 인정한 최고의 아름다움을 가진 도전자들
          </p>
        </div>
        
        {/* 성별 탭 - 모바일 최적화 */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-purple-800/30 backdrop-blur-sm p-1 rounded-xl border border-purple-400/30">
            <button
              onClick={() => setSelectedGender('all')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                selectedGender === 'all'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-purple-700/50'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedGender('male')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                selectedGender === 'male'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-blue-500/50'
              }`}
            >
              🤴 남성
            </button>
            <button
              onClick={() => setSelectedGender('female')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                selectedGender === 'female'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-pink-500/50'
              }`}
            >
              👸 여성
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="relative mb-6 sm:mb-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full p-2 animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-300 rounded-full flex items-center justify-center">
                  <div className="text-3xl sm:text-4xl animate-spin">🏆</div>
                </div>
              </div>
            </div>
            <p className="text-purple-200 text-sm sm:text-base">랭킹 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {images.length === 0 ? (
              <div className="text-center py-12 bg-purple-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-400/30">
                <div className="text-4xl sm:text-5xl mb-4">👑</div>
                <h2 className="text-lg sm:text-xl font-serif text-purple-100 mb-2">아직 랭킹 데이터가 없습니다</h2>
                <p className="text-purple-300 mb-6 text-sm sm:text-base px-4">
                  더 많은 사용자들이 얼굴 평가 대결에 참여하면 랭킹이 생성됩니다.
                </p>
                <button
                  onClick={handleStartNewBattle}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-serif transform hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
                >
                  첫 번째 대결 시작하기
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* 상위 3명 특별 표시 - 모바일 최적화 */}
                {images.slice(0, 3).length > 0 && (
                  <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-400/30 shadow-2xl mb-6 sm:mb-8">
                    <h3 className="text-lg sm:text-xl font-serif text-center mb-4 sm:mb-6 text-yellow-300">
                      ✨ 왕과 여왕의 자리 ✨
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      {images.slice(0, 3).map((image, index) => (
                        <div key={image.id} className="text-center">
                          <div className={`
                            relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden 
                            border-4 ${index === 0 ? 'border-yellow-400' : index === 1 ? 'border-gray-400' : 'border-amber-400'}
                            shadow-xl
                          `}>
                            <img 
                              src={image.imageUrl} 
                              alt={image.userName} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute -top-2 -right-2 text-xl sm:text-2xl">
                              {getRankIcon(index)}
                            </div>
                          </div>
                          <h4 className="text-sm sm:text-base font-serif text-purple-100 mb-1">{image.userName}</h4>
                          <p className="text-xs sm:text-sm text-purple-300">
                            {image.analysis.averageScore.toFixed(1)}점 • {getWinRate(image).toFixed(1)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 전체 랭킹 리스트 - 모바일 최적화 */}
                <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-400/30 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-purple-400/30">
                    <h3 className="text-lg sm:text-xl font-serif text-purple-100 text-center">
                      전체 랭킹
                    </h3>
                  </div>
                  
                  {/* 모바일용 카드 레이아웃 */}
                  <div className="block sm:hidden">
                    {images.map((image, index) => (
                      <div key={image.id} className="p-4 border-b border-purple-400/20 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                            bg-gradient-to-r ${getRankColor(index)}
                          `}>
                            {index < 3 ? getRankIcon(index) : index + 1}
                          </div>
                          
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400">
                            <img 
                              src={image.imageUrl} 
                              alt={image.userName} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-purple-100 truncate">{image.userName}</h4>
                            <div className="flex items-center space-x-2 text-xs text-purple-300">
                              <span>{image.analysis.averageScore.toFixed(1)}점</span>
                              <span>•</span>
                              <span>{getWinRate(image).toFixed(1)}%</span>
                              <span>•</span>
                              <span>{image.battleCount}전 {image.winCount}승</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 데스크톱용 테이블 레이아웃 */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-purple-800/50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                            순위
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                            사용자
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                            이미지
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                            평균 점수
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                            승률
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                            대결 수
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-400/20">
                        {images.map((image, index) => (
                          <tr key={image.id} className={`${index < 3 ? 'bg-yellow-500/10' : 'bg-purple-800/20'} hover:bg-purple-700/30 transition-colors`}>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                                bg-gradient-to-r ${getRankColor(index)}
                              `}>
                                {index < 3 ? getRankIcon(index) : index + 1}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-purple-100">{image.userName}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400">
                                <img 
                                  src={image.imageUrl} 
                                  alt={image.userName} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-purple-100 font-medium">{image.analysis.averageScore.toFixed(1)}점</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-purple-100 font-medium">{getWinRate(image).toFixed(1)}%</div>
                              <div className="w-full h-2 bg-purple-700/50 rounded-full mt-1">
                                <div
                                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300"
                                  style={{ width: `${getWinRate(image)}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                              {image.battleCount}회 중 {image.winCount}승
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="text-center pt-6 sm:pt-8">
                  <button
                    onClick={handleStartNewBattle}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-serif transform hover:scale-105 active:scale-95 transition-all shadow-lg text-sm sm:text-base"
                  >
                    ⚔️ 나도 도전하기 ⚔️
                  </button>
                </div>
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