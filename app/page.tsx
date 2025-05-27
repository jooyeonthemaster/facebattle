'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [isShimmering, setIsShimmering] = useState(false);
  const [isMirrorReflecting, setIsMirrorReflecting] = useState(false);
  const [stars, setStars] = useState<Array<{width: number, height: number, left: number, top: number, delay: number, duration: number}>>([]);

  useEffect(() => {
    // 별 데이터를 클라이언트 사이드에서만 생성
    const starArray = [...Array(50)].map(() => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
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
    setIsMirrorReflecting(true);
    
    // 애니메이션 후 업로드 페이지로 이동
    setTimeout(() => {
      router.push(`/upload?gender=${gender}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden">
      {/* 배경 별 효과 */}
      <div className="fixed inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* 마법의 거울 섹션 */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {/* 거울 프레임 - 더 크게 */}
            <div className={`
              relative w-80 h-80 md:w-96 md:h-96 mx-auto mb-8
              bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600
              rounded-full p-4 shadow-2xl
              ${isShimmering ? 'animate-shimmer' : ''}
              ${isMirrorReflecting ? 'animate-pulse' : ''}
              transform hover:scale-105 transition-all duration-500
            `}>
              <div className="w-full h-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-300 rounded-full flex items-center justify-center relative overflow-hidden">
                {/* 거울 반사 효과 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 transform -translate-x-full animate-mirror-shine" />
                
                {/* 거울 속 텍스트 - 더 크게 */}
                <div className="text-center p-6 animate-float">
                  <p className="text-4xl md:text-5xl font-serif text-purple-900 mb-4 animate-sparkle">✨</p>
                  <p className="text-xl md:text-2xl font-serif text-purple-800 italic font-bold text-shadow-lg animate-glow">
                    거울아 거울아<br/>
                    세상에서 누가<br/>
                    제일 예쁘니?
                  </p>
                </div>
              </div>
            </div>
            
            {/* 거울 장식 - 더 크게 */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 animate-crown-float">
              <div className="text-6xl animate-sparkle">👑</div>
            </div>
            
            {/* 추가 장식 요소들 */}
            <div className="absolute -left-8 top-1/4 animate-float-left">
              <div className="text-4xl animate-sparkle" style={{animationDelay: '0.5s'}}>⭐</div>
            </div>
            <div className="absolute -right-8 top-1/4 animate-float-right">
              <div className="text-4xl animate-sparkle" style={{animationDelay: '1s'}}>⭐</div>
            </div>
            <div className="absolute -left-12 bottom-1/4 animate-float-left">
              <div className="text-3xl animate-sparkle" style={{animationDelay: '1.5s'}}>✨</div>
            </div>
            <div className="absolute -right-12 bottom-1/4 animate-float-right">
              <div className="text-3xl animate-sparkle" style={{animationDelay: '2s'}}>✨</div>
            </div>
          </div>
          
          {/* 메인 타이틀 - 훨씬 더 크고 화려하게 */}
          <div className="relative">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 animate-gradient-x font-bold tracking-wide">
              마법의 거울
            </h1>
            
            {/* 타이틀 배경 효과 */}
            <div className="absolute inset-0 blur-3xl opacity-50">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 animate-gradient-x font-bold">
                마법의 거울
              </h1>
            </div>
          </div>
          
          <p className="text-2xl md:text-3xl text-purple-200 font-serif italic mb-4 animate-fade-in-up">
            당신의 진정한 아름다움을 비춰드립니다
          </p>
          
          <p className="text-base md:text-lg text-purple-300 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            AI 마법사가 당신의 얼굴을 분석하여 <span className="text-yellow-300 font-bold animate-pulse">솔직하고 현실적인</span> 평가를 제공합니다.<br/>
            다른 도전자들과의 미모 대결에서 승리하세요!
          </p>
        </div>

        {/* 성별 선택 섹션 */}
        <div className="bg-purple-800/30 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-purple-400/30 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-serif text-center mb-8 text-purple-100">
            ✨ 당신은 누구인가요? ✨
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => handleGenderSelect('male')}
              className={`
                group relative p-8 rounded-2xl border-2 transition-all duration-300
                ${selectedGender === 'male' 
                  ? 'border-blue-400 bg-blue-500/20 scale-105' 
                  : 'border-purple-400/50 bg-purple-700/20 hover:border-blue-400 hover:bg-blue-500/10'
                }
              `}
              disabled={isMirrorReflecting}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🤴</div>
                <div className="text-xl font-serif text-blue-300 group-hover:text-blue-200">왕자님</div>
                <div className="text-sm text-purple-300 mt-2">남성 도전자</div>
              </div>
              
              {/* 호버 시 반짝임 효과 */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-blue-400/20 animate-pulse" />
              </div>
            </button>
            
            <button
              onClick={() => handleGenderSelect('female')}
              className={`
                group relative p-8 rounded-2xl border-2 transition-all duration-300
                ${selectedGender === 'female' 
                  ? 'border-pink-400 bg-pink-500/20 scale-105' 
                  : 'border-purple-400/50 bg-purple-700/20 hover:border-pink-400 hover:bg-pink-500/10'
                }
              `}
              disabled={isMirrorReflecting}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👸</div>
                <div className="text-xl font-serif text-pink-300 group-hover:text-pink-200">공주님</div>
                <div className="text-sm text-purple-300 mt-2">여성 도전자</div>
              </div>
              
              {/* 호버 시 반짝임 효과 */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-transparent to-pink-400/20 animate-pulse" />
              </div>
            </button>
          </div>
        </div>

        {/* 특징 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 hover:bg-purple-700/30 transition-all duration-300">
            <div className="text-4xl mb-4 text-center">🔮</div>
            <h3 className="text-xl font-serif text-purple-100 mb-2 text-center">마법의 분석</h3>
            <p className="text-purple-200 text-sm text-center">
              AI 마법사가 얼굴의 황금비율, 이목구비, 피부, 분위기를 <span className="text-yellow-300">현실적이고 솔직하게</span> 평가합니다
            </p>
          </div>
          
          <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 hover:bg-purple-700/30 transition-all duration-300">
            <div className="text-4xl mb-4 text-center">⚔️</div>
            <h3 className="text-xl font-serif text-purple-100 mb-2 text-center">미모 대결</h3>
            <p className="text-purple-200 text-sm text-center">
              다른 도전자들과 1:1 대결을 펼쳐 누가 더 아름다운지 겨뤄보세요
            </p>
          </div>
          
          <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 hover:bg-purple-700/30 transition-all duration-300">
            <div className="text-4xl mb-4 text-center">👑</div>
            <h3 className="text-xl font-serif text-purple-100 mb-2 text-center">명예의 전당</h3>
            <p className="text-purple-200 text-sm text-center">
              최고의 미모를 가진 왕과 여왕의 자리를 차지하세요
            </p>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="text-center">
          <p className="text-purple-300 text-sm mb-4">
            ⚡ 이 서비스는 재미를 위한 것이며, AI의 평가가 절대적인 기준이 아닙니다 ⚡
          </p>
        </div>
      </div>

      {/* CSS 애니메이션 추가 */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.3); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        
        @keyframes mirror-shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(200%) translateY(200%) rotate(45deg); }
        }
        
        @keyframes gradient {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-left {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-10px) translateY(-10px); }
        }
        
        @keyframes float-right {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(10px) translateY(-10px); }
        }
        
        @keyframes crown-float {
          0%, 100% { transform: translateX(-50%) translateY(0px) rotate(-5deg); }
          50% { transform: translateX(-50%) translateY(-10px) rotate(5deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            filter: brightness(1);
          }
          50% { 
            transform: scale(1.2) rotate(180deg);
            filter: brightness(1.5);
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(251, 191, 36, 0.8),
                         0 0 40px rgba(251, 191, 36, 0.6),
                         0 0 60px rgba(251, 191, 36, 0.4);
          }
          50% { 
            text-shadow: 0 0 30px rgba(251, 191, 36, 1),
                         0 0 60px rgba(251, 191, 36, 0.8),
                         0 0 90px rgba(251, 191, 36, 0.6);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-twinkle {
          animation: twinkle infinite ease-in-out;
        }
        
        .animate-shimmer {
          animation: shimmer 1s ease-in-out;
        }
        
        .animate-mirror-shine {
          animation: mirror-shine 3s infinite;
        }
        
        .animate-gradient {
          animation: gradient 3s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 4s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-left {
          animation: float-left 3s ease-in-out infinite;
        }
        
        .animate-float-right {
          animation: float-right 3s ease-in-out infinite;
        }
        
        .animate-crown-float {
          animation: crown-float 3s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
