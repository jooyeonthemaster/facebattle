'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/components/Header';
import Link from 'next/link';
import { uploadImage } from '@/src/lib/firebaseService';
import { useAppStore } from '@/src/lib/store';

export default function Home() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [isShimmering, setIsShimmering] = useState(false);
  const [isMirrorReflecting, setIsMirrorReflecting] = useState(false);
  const [stars, setStars] = useState<Array<{width: number, height: number, left: number, top: number, delay: number, duration: number}>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [pendingGender, setPendingGender] = useState<'male' | 'female' | null>(null);
  const { setCurrentImage } = useAppStore();

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
    
    // 반짝임 효과를 주기적으로 실행
    const interval = setInterval(() => {
      setIsShimmering(true);
      setTimeout(() => setIsShimmering(false), 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
    setPendingGender(gender);
    setIsMirrorReflecting(true);
    setShowNameInput(true);
  };

  // 이름 입력 완료 후 파일 선택 시작
  const handleNameSubmit = () => {
    if (!userName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!pendingGender) {
      alert('성별을 다시 선택해주세요.');
      return;
    }
    
    // 파일 입력 요소 생성 및 클릭
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleFileSelect;
    input.click();
  };

  // 파일 선택 처리
  const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    // 파일 크기 검증 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }
    
    await handleImageUpload(file);
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (file: File) => {
    if (!pendingGender || !userName.trim()) return;
    
    try {
      setIsUploading(true);
      
      // 사용자 정보 생성
      const user = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        name: userName.trim(),
        email: 'anonymous@example.com',
        createdAt: new Date()
      };
      
      // 업로드 시점에는 분석하지 않고 빈 분석 객체만 생성
      const emptyAnalysis = {
        goldenRatio: 0,
        goldenRatioDesc: '',
        facialFeatures: 0,
        facialFeaturesDesc: '',
        skinTexture: 0,
        skinTextureDesc: '',
        impressiveness: 0,
        impressivenessDesc: '',
        growingCharm: 0,
        growingCharmDesc: '',
        averageScore: 0,
        persona: '',
        description: ''
      };
      
      // Firebase에 이미지 업로드 및 저장
      const uploadedImage = await uploadImage(file, user, emptyAnalysis, pendingGender);
      
      // 저장된 이미지 정보를 전역 상태에 저장
      setCurrentImage(uploadedImage);
      
      // 바로 대결 페이지로 이동
      router.push('/battle');
      
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error);
      alert('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

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
        {/* 마법의 거울 섹션 */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* 거울 프레임 - 모바일 최적화 */}
            <div className={`
              relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto mb-6
              bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600
              rounded-full p-3 sm:p-4 shadow-2xl
              ${isShimmering ? 'animate-pulse' : ''}
              ${isMirrorReflecting ? 'animate-pulse' : ''}
              transform hover:scale-105 transition-all duration-500
            `}>
              <div className="w-full h-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-300 rounded-full flex items-center justify-center relative overflow-hidden">
                {/* 거울 반사 효과 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30" />
                
                {/* 거울 속 텍스트 - 모바일 최적화 */}
                <div className="text-center p-4 sm:p-6">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-serif text-purple-900 mb-2 sm:mb-4">✨</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-serif text-purple-800 italic font-bold leading-tight">
                    거울아 거울아<br/>
                    세상에서 누가<br/>
                    제일 예쁘니?
                  </p>
                </div>
              </div>
            </div>
            
            {/* 거울 장식 - 모바일 최적화 */}
            <div className="absolute -top-6 sm:-top-8 md:-top-10 left-1/2 transform -translate-x-1/2">
              <div className="text-4xl sm:text-5xl md:text-6xl">👑</div>
            </div>
            
            {/* 추가 장식 요소들 - 모바일에서 크기 조정 */}
            <div className="absolute -left-4 sm:-left-6 md:-left-8 top-1/4">
              <div className="text-2xl sm:text-3xl md:text-4xl">⭐</div>
            </div>
            <div className="absolute -right-4 sm:-right-6 md:-right-8 top-1/4">
              <div className="text-2xl sm:text-3xl md:text-4xl">⭐</div>
            </div>
          </div>
          
          {/* 메인 타이틀 - 모바일 최적화 */}
          <div className="relative mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 font-bold tracking-wide">
              마법의 거울
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-purple-200 font-serif italic mb-3">
            당신의 진정한 아름다움을 비춰드립니다
          </p>
          
          <p className="text-sm sm:text-base md:text-lg text-purple-300 max-w-2xl mx-auto px-4">
            AI 마법사가 당신의 얼굴을 분석하여 <span className="text-yellow-300 font-bold">솔직하고 현실적인</span> 평가를 제공합니다.<br/>
            다른 도전자들과의 미모 대결에서 승리하세요!
          </p>
        </div>

        {/* 성별 선택 섹션 - 모바일 최적화 */}
        <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8 border border-purple-400/30 shadow-2xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-center mb-6 sm:mb-8 text-purple-100">
            ✨ 당신은 누구인가요? ✨
          </h2>
          
          {!showNameInput && !isUploading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => handleGenderSelect('male')}
                className={`
                  group relative p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-300
                  ${selectedGender === 'male' 
                    ? 'border-blue-400 bg-blue-500/20 scale-105' 
                    : 'border-purple-400/50 bg-purple-700/20 hover:border-blue-400 hover:bg-blue-500/10 active:scale-95'
                  }
                `}
                disabled={isMirrorReflecting}
              >
                <div className="text-center">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">🤴</div>
                  <div className="text-lg sm:text-xl font-serif text-blue-300 group-hover:text-blue-200">왕자님</div>
                  <div className="text-xs sm:text-sm text-purple-300 mt-1 sm:mt-2">남성 도전자</div>
                </div>
                
                {/* 호버 시 반짝임 효과 */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-blue-400/20 animate-pulse" />
                </div>
              </button>
              
              <button
                onClick={() => handleGenderSelect('female')}
                className={`
                  group relative p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-300
                  ${selectedGender === 'female' 
                    ? 'border-pink-400 bg-pink-500/20 scale-105' 
                    : 'border-purple-400/50 bg-purple-700/20 hover:border-pink-400 hover:bg-pink-500/10 active:scale-95'
                  }
                `}
                disabled={isMirrorReflecting}
              >
                <div className="text-center">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">👸</div>
                  <div className="text-lg sm:text-xl font-serif text-pink-300 group-hover:text-pink-200">공주님</div>
                  <div className="text-xs sm:text-sm text-purple-300 mt-1 sm:mt-2">여성 도전자</div>
                </div>
                
                {/* 호버 시 반짝임 효과 */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-transparent to-pink-400/20 animate-pulse" />
                </div>
              </button>
            </div>
          ) : showNameInput && !isUploading ? (
            /* 이름 입력 섹션 */
            <div className="max-w-md mx-auto text-center">
              <div className="text-4xl mb-4">
                {pendingGender === 'male' ? '🤴' : '👸'}
              </div>
              <h3 className="text-xl font-serif text-purple-100 mb-4">
                {pendingGender === 'male' ? '왕자님' : '공주님'}의 이름을 알려주세요
              </h3>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="이름을 입력해주세요"
                className="w-full px-4 py-3 rounded-xl border border-purple-300 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center font-medium mb-4"
                maxLength={20}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
              <p className="text-purple-300 text-xs mb-4">
                랭킹에 표시될 이름입니다 (최대 20자)
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowNameInput(false);
                    setPendingGender(null);
                    setSelectedGender(null);
                    setUserName('');
                  }}
                  className="px-4 py-2 rounded-lg border border-purple-400 text-purple-200 hover:bg-purple-700/30 transition-colors"
                >
                  다시 선택
                </button>
                <button
                  onClick={handleNameSubmit}
                  disabled={!userName.trim()}
                  className={`px-6 py-2 rounded-lg font-serif transition-all ${
                    userName.trim()
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  이미지 선택하기
                </button>
              </div>
            </div>
          ) : (
            /* 업로딩 상태 */
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full p-2 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-300 rounded-full flex items-center justify-center">
                    <div className="text-2xl animate-spin">✨</div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-serif text-purple-100 mb-2">
                마법의 거울이 준비 중입니다...
              </h3>
              <p className="text-purple-300 text-sm">
                {userName}님의 이미지를 업로드하고 있어요
              </p>
            </div>
          )}
        </div>

        {/* 특징 섹션 - 모바일 최적화 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-purple-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-400/30 hover:bg-purple-700/30 transition-all duration-300">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 text-center">🔮</div>
            <h3 className="text-lg sm:text-xl font-serif text-purple-100 mb-2 text-center">마법의 분석</h3>
            <p className="text-purple-200 text-xs sm:text-sm text-center leading-relaxed">
              AI 마법사가 얼굴의 황금비율, 이목구비, 피부, 분위기를 <span className="text-yellow-300">현실적이고 솔직하게</span> 평가합니다
            </p>
          </div>

          <div className="bg-purple-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-400/30 hover:bg-purple-700/30 transition-all duration-300">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 text-center">⚔️</div>
            <h3 className="text-lg sm:text-xl font-serif text-purple-100 mb-2 text-center">1:1 대결</h3>
            <p className="text-purple-200 text-xs sm:text-sm text-center leading-relaxed">
              같은 성별의 다른 도전자와 <span className="text-yellow-300">실시간 미모 대결</span>을 펼치세요
            </p>
          </div>

          <div className="bg-purple-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-400/30 hover:bg-purple-700/30 transition-all duration-300">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 text-center">🏆</div>
            <h3 className="text-lg sm:text-xl font-serif text-purple-100 mb-2 text-center">랭킹 시스템</h3>
            <p className="text-purple-200 text-xs sm:text-sm text-center leading-relaxed">
              승리를 쌓아 <span className="text-yellow-300">왕과 여왕의 자리</span>에 도전하세요
            </p>
          </div>
        </div>

        {/* 안내 메시지 - 모바일 최적화 */}
        <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-400/30 text-center mb-6">
          <p className="text-purple-200 text-sm sm:text-base leading-relaxed">
            ⚠️ <span className="text-yellow-300 font-bold">주의:</span> 마법의 거울은 거짓말을 하지 않습니다.<br/>
            <span className="text-xs sm:text-sm text-purple-300 mt-1 block">
              가장 잘 나온 사진을 업로드하여 정확한 평가를 받아보세요
            </span>
          </p>
        </div>

        {/* 개인정보 보호 안내 */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-400/30">
          <div className="text-center mb-4">
            <div className="text-2xl sm:text-3xl mb-2">🔒</div>
            <h3 className="text-lg sm:text-xl font-serif text-green-100 mb-2">개인정보 보호 약속</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span className="text-green-200">서비스 제공을 위해 안전하게 보관 (최대 1년)</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span className="text-green-200">서비스 목적 외 개인정보 활용 금지</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span className="text-green-200">생체정보 처리 동의 후 서비스 이용</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span className="text-green-200">사용자 요청 시 즉시 삭제 처리</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-green-400/20 text-center">
            <p className="text-green-300 text-xs">
              서비스 이용 전 
              <Link href="/terms" className="text-green-100 hover:text-white underline mx-1">이용약관</Link>
              및
              <Link href="/privacy" className="text-green-100 hover:text-white underline mx-1">개인정보처리방침</Link>
              을 확인해 주세요
            </p>
          </div>
        </div>
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
