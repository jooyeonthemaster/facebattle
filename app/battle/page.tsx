'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/components/Header';
import { getRandomImageForBattle, saveBattleResult } from '@/src/lib/firebaseService';
import { compareImages } from '@/src/lib/gemini';
import { parseComparisonResult } from '@/src/lib/parseUtils';
import { useAppStore } from '@/src/lib/store';
import { Image as ImageType } from '@/src/types';

export default function BattlePage() {
  const router = useRouter();
  const { currentImage } = useAppStore();
  const [opponentImage, setOpponentImage] = useState<ImageType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stars, setStars] = useState<Array<{width: number, height: number, left: number, top: number, delay: number, duration: number}>>([]);
  
  // 개인정보 동의 상태
  const [privacyConsent, setPrivacyConsent] = useState({
    termsOfService: false,
    privacyPolicy: false,
    biometricData: false,
    allRequired: false
  });

  // 대결 시작 준비 상태
  const [isReadyToBattle, setIsReadyToBattle] = useState(false);
  
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
  }, [currentImage, router]);

  // 개인정보 동의 처리
  const handleConsentChange = (key: keyof typeof privacyConsent, value: boolean) => {
    const newConsents = { ...privacyConsent, [key]: value };
    
    // 전체 필수 동의 상태 업데이트
    newConsents.allRequired = newConsents.termsOfService && 
                              newConsents.privacyPolicy && 
                              newConsents.biometricData;
    
    setPrivacyConsent(newConsents);
  };

  const handleAllRequiredChange = (value: boolean) => {
    const newConsents = {
      termsOfService: value,
      privacyPolicy: value,
      biometricData: value,
      allRequired: value,
    };
    
    setPrivacyConsent(newConsents);
  };

  // 대결 시작 함수
  const startBattle = async () => {
    if (!privacyConsent.allRequired) {
      alert('개인정보 처리에 동의해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setIsReadyToBattle(true);
      
      // 랜덤 대결 상대 이미지 가져오기 (같은 성별끼리만)
      const opponent = await getRandomImageForBattle(currentImage!.id, currentImage!.gender);
      
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
        await fetch(currentImage!.imageUrl).then(res => res.blob()).then(blob => new File([blob], 'image1.jpg', { type: 'image/jpeg' })),
        await fetch(opponent.imageUrl).then(res => res.blob()).then(blob => new File([blob], 'image2.jpg', { type: 'image/jpeg' }))
      );
      
      // 비교 결과 파싱
      const parsedResult = parseComparisonResult(result);
      
      // 파싱 실패 체크 및 백업 로직
      const isImage1ParsedCorrectly = parsedResult.image1Analysis.averageScore > 0 || 
        parsedResult.image1Analysis.goldenRatio > 0 || 
        parsedResult.image1Analysis.facialFeatures > 0;
        
      const isImage2ParsedCorrectly = parsedResult.image2Analysis.averageScore > 0 || 
        parsedResult.image2Analysis.goldenRatio > 0 || 
        parsedResult.image2Analysis.facialFeatures > 0;
      
      // 파싱 실패 시 백업 로직 - 임시로 랜덤 점수 부여
      if (!isImage1ParsedCorrectly) {
        parsedResult.image1Analysis = {
          goldenRatio: Math.random() * 3 + 5, // 5-8점 사이
          goldenRatioDesc: '분석 중 오류가 발생했습니다',
          facialFeatures: Math.random() * 3 + 5,
          facialFeaturesDesc: '분석 중 오류가 발생했습니다',
          skinTexture: Math.random() * 3 + 5,
          skinTextureDesc: '분석 중 오류가 발생했습니다',
          impressiveness: Math.random() * 3 + 5,
          impressivenessDesc: '분석 중 오류가 발생했습니다',
          growingCharm: Math.random() * 3 + 5,
          growingCharmDesc: '분석 중 오류가 발생했습니다',
          averageScore: Math.random() * 3 + 5,
          persona: '신비로운 매력',
          description: '분석 중 일시적인 오류가 발생했습니다'
        };
      }
      
      if (!isImage2ParsedCorrectly) {
        parsedResult.image2Analysis = {
          goldenRatio: Math.random() * 3 + 5, // 5-8점 사이
          goldenRatioDesc: '분석 중 오류가 발생했습니다',
          facialFeatures: Math.random() * 3 + 5,
          facialFeaturesDesc: '분석 중 오류가 발생했습니다',
          skinTexture: Math.random() * 3 + 5,
          skinTextureDesc: '분석 중 오류가 발생했습니다',
          impressiveness: Math.random() * 3 + 5,
          impressivenessDesc: '분석 중 오류가 발생했습니다',
          growingCharm: Math.random() * 3 + 5,
          growingCharmDesc: '분석 중 오류가 발생했습니다',
          averageScore: Math.random() * 3 + 5,
          persona: '신비로운 매력',
          description: '분석 중 일시적인 오류가 발생했습니다'
        };
      }
      
      // 현재 이미지와 상대방 이미지의 분석 결과 업데이트
      const updatedCurrentImage = {
        ...currentImage!,
        analysis: {
          ...currentImage!.analysis,
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
      
      // 배틀 결과 저장 (이미지 데이터도 함께 저장)
      const battleResult = await saveBattleResult(
        currentImage!.id,
        opponent.id,
        winner.id,
        result,
        updatedCurrentImage,
        updatedOpponentImage
      );
      
      // 결과를 드라마틱하게 표시하는 대신 바로 공유 페이지로 리다이렉트
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 공유 페이지로 즉시 리다이렉트 (파싱 문제 우회)
      router.push(`/battle/result/${battleResult.id}`);
    } catch (err) {
      console.error('배틀 중 오류:', err);
      setError('배틀 진행 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
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
              onClick={() => router.push('/')}
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-6 sm:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
          ⚔️ 아름다움의 결투장 ⚔️
        </h1>
        
        {!isReadyToBattle && !isLoading ? (
          // 개인정보 동의 및 대결 준비 단계
          <div className="max-w-2xl mx-auto">
            {/* 현재 이미지 미리보기 */}
            {currentImage && (
              <div className="bg-purple-900/30 backdrop-blur-sm border-2 border-purple-400/30 rounded-xl p-6 mb-6 text-center">
                <h2 className="text-lg font-serif text-purple-100 mb-4">👑 당신의 도전 이미지</h2>
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-400/50">
                  <img 
                    src={currentImage.imageUrl} 
                    alt="당신의 이미지" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-purple-200 text-sm">
                  {currentImage.gender === 'male' ? '🤴 왕자님' : '👸 공주님'}
                </p>
              </div>
            )}

            {/* 개인정보 동의 체크박스 */}
            <div className="bg-purple-900/20 backdrop-blur-sm border-2 border-purple-400/30 rounded-xl p-6 shadow-lg mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-serif text-purple-100 mb-2 flex items-center">
                  🛡️ 개인정보 처리 동의
                </h3>
                <p className="text-sm text-purple-200">
                  대결 시작 전 개인정보 처리에 동의해주세요
                </p>
              </div>

              <div className="space-y-3">
                {/* 전체 필수 동의 */}
                <div className="p-3 bg-gradient-to-r from-purple-700/30 to-pink-700/30 border border-purple-400/40 rounded-lg">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer hover:bg-purple-600/20 p-2 rounded transition-colors"
                    onClick={() => handleAllRequiredChange(!privacyConsent.allRequired)}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      privacyConsent.allRequired 
                        ? 'bg-purple-500 border-purple-500' 
                        : 'bg-transparent border-purple-300 hover:border-purple-400'
                    }`}>
                      {privacyConsent.allRequired && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-serif text-purple-100 font-semibold">
                        ✨ 필수 약관 전체 동의
                      </span>
                      <p className="text-xs text-purple-200 mt-1">
                        서비스 이용약관, 개인정보처리방침, 생체정보 처리 동의
                      </p>
                    </div>
                  </div>
                </div>

                {/* 개별 동의 항목들 */}
                <div className="space-y-2 text-sm">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer text-purple-200 hover:text-purple-100 hover:bg-purple-800/20 p-2 rounded transition-colors"
                    onClick={() => handleConsentChange('termsOfService', !privacyConsent.termsOfService)}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      privacyConsent.termsOfService 
                        ? 'bg-purple-500 border-purple-500' 
                        : 'bg-transparent border-purple-300 hover:border-purple-400'
                    }`}>
                      {privacyConsent.termsOfService && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1">[필수] 서비스 이용약관</span>
                  </div>

                  <div 
                    className="flex items-center space-x-3 cursor-pointer text-purple-200 hover:text-purple-100 hover:bg-purple-800/20 p-2 rounded transition-colors"
                    onClick={() => handleConsentChange('privacyPolicy', !privacyConsent.privacyPolicy)}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      privacyConsent.privacyPolicy 
                        ? 'bg-purple-500 border-purple-500' 
                        : 'bg-transparent border-purple-300 hover:border-purple-400'
                    }`}>
                      {privacyConsent.privacyPolicy && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1">[필수] 개인정보처리방침</span>
                  </div>

                  <div 
                    className="flex items-center space-x-3 cursor-pointer text-purple-200 hover:text-purple-100 hover:bg-purple-800/20 p-2 rounded transition-colors"
                    onClick={() => handleConsentChange('biometricData', !privacyConsent.biometricData)}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      privacyConsent.biometricData 
                        ? 'bg-purple-500 border-purple-500' 
                        : 'bg-transparent border-purple-300 hover:border-purple-400'
                    }`}>
                      {privacyConsent.biometricData && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1">[필수] 생체정보(얼굴) 처리 동의</span>
                  </div>
                </div>

                {/* 간단한 안내 */}
                <div className="mt-4 p-3 bg-purple-800/30 border border-purple-500/30 rounded-lg">
                  <p className="text-xs text-purple-200 flex items-start space-x-2">
                    <span>💡</span>
                    <span>
                      업로드된 이미지는 AI 분석 목적으로만 사용되며, 
                      사용자 요청시 언제든 삭제됩니다.
                    </span>
                  </p>
                </div>

                {/* 동의 상태 표시 */}
                <div className="text-center">
                  {privacyConsent.allRequired ? (
                    <p className="text-green-300 font-serif text-sm">
                      ✅ 필수 동의 완료! 대결을 시작할 수 있습니다.
                    </p>
                  ) : (
                    <p className="text-yellow-300 font-serif text-sm">
                      ⚠️ 필수 약관 동의가 필요합니다.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 대결 시작 버튼 */}
            <div className="text-center">
              <button
                onClick={startBattle}
                disabled={!privacyConsent.allRequired}
                className={`
                  px-8 py-4 rounded-xl font-serif text-lg transform transition-all duration-300
                  ${privacyConsent.allRequired
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                  }
                `}
              >
                ⚔️ 대결 시작하기
              </button>
            </div>
          </div>
        ) : isLoading ? (
          // 대결 진행 중
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="relative mb-6 sm:mb-8">
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
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚔️</div>
            <p className="text-xl text-purple-200">대결이 완료되었습니다!</p>
            <p className="text-purple-300 text-sm mt-2">결과 페이지로 이동 중...</p>
          </div>
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