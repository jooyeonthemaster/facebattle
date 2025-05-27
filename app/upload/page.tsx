'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/src/components/Header';
import ImageUploader from '@/src/components/ImageUploader';
import { analyzeImage } from '@/src/lib/gemini';
import { uploadImage } from '@/src/lib/firebaseService';
import { useAppStore } from '@/src/lib/store';
import { Analysis } from '@/src/types';

// 임시 사용자 정보
const mockUser = {
  id: 'user-' + Math.random().toString(36).substring(2, 9),
  name: '익명 사용자',
  email: 'anonymous@example.com',
  createdAt: new Date()
};

function UploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'upload' | 'processing'>('upload');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [stars, setStars] = useState<Array<{width: number, height: number, left: number, top: number, delay: number, duration: number}>>([]);
  const { setCurrentImage } = useAppStore();
  
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
    
    // URL 파라미터에서 성별 정보 가져오기
    const genderParam = searchParams.get('gender');
    if (genderParam === 'male' || genderParam === 'female') {
      setSelectedGender(genderParam);
    } else {
      // 성별이 없으면 메인 페이지로 리다이렉트
      router.push('/');
    }
  }, [searchParams, router]);

  // 이미지가 선택되었을 때 호출되는 함수
  const handleImageSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadComplete(false);
  };
  
  // 분석 결과 텍스트를 파싱하여 Analysis 객체로 변환하는 함수
  const parseAnalysisResult = (text: string): Analysis => {
    // 기본값 설정
    const result: Analysis = {
      goldenRatio: 0,
      facialFeatures: 0,
      skinTexture: 0,
      impressiveness: 0,
      growingCharm: 0,
      averageScore: 0,
      description: text,
      goldenRatioDesc: "",
      facialFeaturesDesc: "",
      skinTextureDesc: "",
      impressivenessDesc: "",
      growingCharmDesc: "",
      persona: ""
    };
    
    try {
      // 황금비율 점수 및 설명 추출
      const goldenRatioMatch = text.match(/황금비율 점수:\s*(\d+)점\s*\n([^\n]+)/);
      if (goldenRatioMatch) {
        result.goldenRatio = parseInt(goldenRatioMatch[1], 10);
        result.goldenRatioDesc = goldenRatioMatch[2].trim();
      }
      
      // 이목구비 정밀도 점수 및 설명 추출
      const facialFeaturesMatch = text.match(/이목구비 정밀도:\s*(\d+)점\s*\n([^\n]+)/);
      if (facialFeaturesMatch) {
        result.facialFeatures = parseInt(facialFeaturesMatch[1], 10);
        result.facialFeaturesDesc = facialFeaturesMatch[2].trim();
      }
      
      // 피부 텍스처 점수 및 설명 추출
      const skinTextureMatch = text.match(/피부 텍스처:\s*(\d+)점\s*\n([^\n]+)/);
      if (skinTextureMatch) {
        result.skinTexture = parseInt(skinTextureMatch[1], 10);
        result.skinTextureDesc = skinTextureMatch[2].trim();
      }
      
      // 분위기 점수 및 설명 추출
      const impressivenessMatch = text.match(/분위기:\s*(\d+)점\s*\n([^\n]+)/);
      if (impressivenessMatch) {
        result.impressiveness = parseInt(impressivenessMatch[1], 10);
        result.impressivenessDesc = impressivenessMatch[2].trim();
      }
      
      // 볼매 지수 점수 및 설명 추출
      const growingCharmMatch = text.match(/볼매 지수:\s*(\d+)점\s*\n([^\n]+)/);
      if (growingCharmMatch) {
        result.growingCharm = parseInt(growingCharmMatch[1], 10);
        result.growingCharmDesc = growingCharmMatch[2].trim();
      }
      
      // 페르소나 추출
      const personaMatch = text.match(/\*\*페르소나:\*\*\s*\n([^\n]+)/);
      if (personaMatch) {
        result.persona = personaMatch[1].trim();
      }
      
      // 평균 점수 계산 또는 추출
      const averageScoreMatch = text.match(/평균 점수:\s*(\d+\.?\d*)점/);
      if (averageScoreMatch) {
        result.averageScore = parseFloat(averageScoreMatch[1]);
      } else {
        // 평균 점수가 명시적으로 제공되지 않은 경우 계산
        const scores = [
          result.goldenRatio, 
          result.facialFeatures, 
          result.skinTexture, 
          result.impressiveness, 
          result.growingCharm
        ].filter(score => score > 0);
        
        if (scores.length > 0) {
          result.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        }
      }
    } catch (error) {
      console.error('분석 결과 파싱 중 오류:', error);
    }
    
    return result;
  };
  
  // 이미지 분석 및 업로드 함수
  const handleUploadImage = async () => {
    if (!file || !selectedGender || !userName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // 사용자 정보 생성 (입력받은 이름 사용)
      const user = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        name: userName.trim(),
        email: 'anonymous@example.com',
        createdAt: new Date()
      };
      
      // Gemini API를 사용하여 이미지 분석 (사용자에게 보여주지 않고 백그라운드에서 처리)
      const rawResult = await analyzeImage(file);
      
      // 분석 결과 파싱
      const parsedResult = parseAnalysisResult(rawResult);
      
      // Firebase에 이미지 업로드 및 저장
      const uploadedImage = await uploadImage(file, user, parsedResult, selectedGender);
      
      // 저장된 이미지 정보를 전역 상태에 저장
      setCurrentImage(uploadedImage);
      
      // 업로드 완료 상태로 변경
      setUploadComplete(true);
      setUploadedImageUrl(uploadedImage.imageUrl);
      
      // 배틀 페이지로 이동하지 않음
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      alert('이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // 배틀 페이지로 이동하는 함수
  const goToBattle = () => {
    router.push('/battle');
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

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
            마법의 거울에게 보여주세요
          </h1>
          <p className="text-purple-200 text-base sm:text-lg">
            {selectedGender === 'male' ? '🤴 왕자님' : '👸 공주님'}의 진정한 아름다움을 평가해드립니다
          </p>
        </div>
        
        {/* 안내 카드 */}
        <div className="bg-purple-800/40 backdrop-blur-sm text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl mb-6 sm:mb-8 border border-purple-400/30">
          <p className="text-base sm:text-lg mb-3 sm:mb-4 font-serif text-purple-100 leading-relaxed">
            거울은 거짓말을 하지 않습니다. 당신의 얼굴을 <span className="text-yellow-300 font-bold">솔직하고 현실적으로</span> 평가해드립니다.
            마법의 거울은 황금비율, 이목구비, 피부, 분위기를 종합적으로 분석합니다.
          </p>
          <p className="text-xs sm:text-sm text-purple-300">
            ✨ 가장 잘 나온 사진을 올려주세요. 거울은 모든 것을 꿰뚫어 봅니다.
          </p>
        </div>

        {/* 이름 입력 섹션 */}
        <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-purple-400/30">
          <h2 className="text-lg sm:text-xl font-serif text-purple-100 mb-4 text-center">
            ✨ 당신의 이름을 알려주세요 ✨
          </h2>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 rounded-xl bg-purple-800/50 border border-purple-400/50 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
              maxLength={20}
            />
            <p className="text-xs text-purple-300 mt-2 text-center">
              랭킹과 대결에서 표시될 이름입니다 (최대 20자)
            </p>
          </div>
        </div>

        {/* 이미지 업로드 섹션 */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-400/30">
            <h2 className="text-lg sm:text-xl font-serif text-purple-100 mb-4 sm:mb-6 text-center">
              ✨ 당신의 모습을 보여주세요 ✨
            </h2>
            <ImageUploader 
              onImageSelect={handleImageSelect} 
              isUploading={isProcessing} 
            />
          </div>
        </div>
        
        {file && !uploadComplete && (
          <div className="mb-6 sm:mb-8">
            <button
              onClick={handleUploadImage}
              disabled={isProcessing || !userName.trim()}
              className={`
                w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-serif text-lg sm:text-xl text-white 
                shadow-xl transform transition-all duration-300
                ${isProcessing || !userName.trim()
                  ? 'bg-purple-600/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-2xl active:scale-95'
                }
              `}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-3"></div>
                  마법의 거울이 분석 중...
                </div>
              ) : !userName.trim() ? '이름을 먼저 입력해주세요' : '✨ 이미지 업로드 ✨'}
            </button>
          </div>
        )}
        
        {uploadComplete && uploadedImageUrl && (
          <div className="mb-6 sm:mb-8 bg-purple-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-yellow-400/50 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 mb-4 sm:mb-6 relative overflow-hidden rounded-full border-4 border-yellow-400 shadow-xl">
                <img 
                  src={uploadedImageUrl} 
                  alt="업로드된 이미지" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
              <div className="bg-yellow-500/20 px-4 sm:px-6 py-2 rounded-full text-yellow-300 font-serif text-base sm:text-lg mb-3">
                ✨ 분석 완료 ✨
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-yellow-300 mb-2 text-center">
                {userName}님을 거울이 기억했습니다
              </h3>
              <p className="text-purple-200 text-center mb-4 sm:mb-6 text-sm sm:text-base px-4">
                이제 다른 도전자들과 아름다움을 겨뤄보세요
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md">
                <button
                  onClick={() => {
                    setFile(null);
                    setUploadComplete(false);
                    setUploadedImageUrl(null);
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-700/50 hover:bg-purple-700/70 text-purple-200 rounded-lg sm:rounded-xl backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                >
                  다시 선택하기
                </button>
                
                <button
                  onClick={goToBattle}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white font-serif text-base sm:text-lg rounded-lg sm:rounded-xl transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  ⚔️ 대결 시작하기 ⚔️
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 사용 방법 안내 */}
        <div className="bg-purple-900/30 backdrop-blur-sm text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-400/30">
          <h3 className="font-serif text-yellow-300 mb-3 sm:mb-4 text-lg sm:text-xl text-center">✨ 마법의 거울 사용법 ✨</h3>
          <div className="space-y-2 sm:space-y-3 text-purple-200">
            <div className="flex items-start">
              <span className="bg-purple-700/50 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-xs mr-2 sm:mr-3 flex-shrink-0 text-yellow-300">1</span>
              <span className="text-xs sm:text-sm">이름을 입력하고 가장 아름다운 순간의 사진을 선택하세요</span>
            </div>
            <div className="flex items-start">
              <span className="bg-purple-700/50 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-xs mr-2 sm:mr-3 flex-shrink-0 text-yellow-300">2</span>
              <span className="text-xs sm:text-sm">마법의 거울이 황금비율, 이목구비, 피부, 분위기를 분석합니다</span>
            </div>
            <div className="flex items-start">
              <span className="bg-purple-700/50 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-xs mr-2 sm:mr-3 flex-shrink-0 text-yellow-300">3</span>
              <span className="text-xs sm:text-sm">다른 도전자와 1:1 대결로 진정한 미모를 증명하세요</span>
            </div>
            <div className="flex items-start">
              <span className="bg-purple-700/50 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-xs mr-2 sm:mr-3 flex-shrink-0 text-yellow-300">4</span>
              <span className="text-xs sm:text-sm">왕과 여왕의 자리에 도전하세요</span>
            </div>
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

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">로딩 중...</p>
        </div>
      </div>
    }>
      <UploadContent />
    </Suspense>
  );
} 