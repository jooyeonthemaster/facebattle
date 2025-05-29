'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/src/components/Header';
import ImageUploader from '@/src/components/ImageUploader';
import PrivacyConsent, { ConsentState } from '@/src/components/PrivacyConsent';
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
  const [step, setStep] = useState<'consent' | 'upload' | 'processing'>('consent');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [stars, setStars] = useState<Array<{width: number, height: number, left: number, top: number, delay: number, duration: number}>>([]);
  const [showConsentModal, setShowConsentModal] = useState(true);
  const [consents, setConsents] = useState<ConsentState>({
    termsOfService: false,
    privacyPolicy: false,
    biometricData: false,
    marketing: false,
    allRequired: false,
  });
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

  // 개인정보 동의 상태 변경 핸들러
  const handleConsentChange = (newConsents: ConsentState) => {
    setConsents(newConsents);
  };

  // 동의 완료 후 업로드 단계로 이동
  const handleConsentComplete = () => {
    if (consents.allRequired) {
      setShowConsentModal(false);
      setStep('upload');
    } else {
      alert('서비스 이용을 위해 필수 약관에 모두 동의해 주세요.');
    }
  };

  // 이미지가 선택되었을 때 호출되는 함수
  const handleImageSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadComplete(false);
  };
  
  // 이미지 분석 및 업로드 함수
  const handleUploadImage = async () => {
    if (!file || !selectedGender || !userName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    // 동의 상태 재확인
    if (!consents.allRequired) {
      alert('개인정보 처리에 대한 동의가 필요합니다.');
      setShowConsentModal(true);
      return;
    }
    
    try {
      setIsProcessing(true);
      setStep('processing');
      
      // 사용자 정보 생성 (입력받은 이름 사용)
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
      
      // Firebase에 이미지 업로드 및 저장 (빈 분석 객체와 함께)
      const uploadedImage = await uploadImage(file, user, emptyAnalysis, selectedGender);
      
      // 저장된 이미지 정보를 전역 상태에 저장
      setCurrentImage(uploadedImage);
      
      // 업로드 완료 상태로 변경
      setUploadComplete(true);
      setUploadedImageUrl(uploadedImage.imageUrl);
      
      // 배틀 페이지로 이동하지 않음
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      alert('이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      setStep('upload');
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
      
      {/* 개인정보 동의서 모달 */}
      <PrivacyConsent 
        isVisible={showConsentModal}
        onConsentChange={handleConsentChange}
      />
      
      {/* 동의 완료 후 업로드 단계로 이동 버튼 */}
      {showConsentModal && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={handleConsentComplete}
            disabled={!consents.allRequired}
            className={`px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 ${
              consents.allRequired
                ? 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {consents.allRequired ? '동의 완료 - 서비스 이용하기' : '필수 약관에 동의해 주세요'}
          </button>
        </div>
      )}
      
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
        {/* 개인정보 동의 완료 안내 */}
        {step !== 'consent' && !showConsentModal && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span className="text-green-800 font-medium">개인정보 처리 동의 완료</span>
              <button
                onClick={() => setShowConsentModal(true)}
                className="text-green-600 text-sm hover:underline ml-auto"
              >
                동의 내용 다시 보기
              </button>
            </div>
            <p className="text-green-700 text-sm mt-1">
              얼굴 이미지는 분석 완료 즉시 자동으로 삭제됩니다.
            </p>
          </div>
        )}

        {step === 'upload' && (
          <>
            {/* 제목 섹션 */}
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 font-bold mb-4">
                마법의 거울
              </h1>
              <p className="text-xl sm:text-2xl text-purple-200 font-serif italic mb-2">
                {selectedGender === 'male' ? '🤴 왕자님' : '👸 공주님'}의 아름다움을 분석해드립니다
              </p>
              <p className="text-purple-300 text-sm sm:text-base">
                AI 마법사가 당신의 진정한 매력을 발견해드릴게요
              </p>
            </div>

            {/* 이름 입력 섹션 */}
            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-purple-400/30">
              <h2 className="text-xl font-serif text-purple-100 mb-4 text-center">
                ✨ 당신의 이름을 알려주세요 ✨
              </h2>
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  className="w-full px-4 py-3 rounded-xl border border-purple-300 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center font-medium"
                  maxLength={20}
                />
                <p className="text-purple-300 text-xs text-center mt-2">
                  랭킹에 표시될 이름입니다 (최대 20자)
                </p>
              </div>
            </div>

            {/* 이미지 업로더 */}
            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-purple-400/30">
              <ImageUploader onImageSelect={handleImageSelect} />
            </div>

            {/* 업로드 버튼 */}
            {file && userName.trim() && (
              <div className="text-center">
                <button
                  onClick={handleUploadImage}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                >
                  {isProcessing ? '마법의 분석 중...' : '✨ 마법의 분석 시작하기 ✨'}
                </button>
                <p className="text-purple-300 text-sm mt-3">
                  분석에는 약 10-30초가 소요됩니다
                </p>
              </div>
            )}
          </>
        )}

        {step === 'processing' && (
          <div className="text-center">
            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
              <div className="animate-spin w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full mx-auto mb-6"></div>
              <h2 className="text-2xl font-serif text-purple-100 mb-4">🔮 마법의 분석 중...</h2>
              <p className="text-purple-300 mb-4">AI 마법사가 당신의 아름다움을 세심하게 분석하고 있습니다</p>
              <div className="text-purple-200 text-sm">
                <p>✨ 황금비율 측정 중...</p>
                <p>✨ 이목구비 정밀도 분석 중...</p>
                <p>✨ 피부 텍스처 검사 중...</p>
                <p>✨ 전체적인 분위기 평가 중...</p>
              </div>
            </div>
          </div>
        )}

        {uploadComplete && uploadedImageUrl && (
          <div className="text-center">
            <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 mb-6">
              <h2 className="text-3xl font-serif text-purple-100 mb-6">🎉 업로드 완료!</h2>
              
              <div className="mb-6">
                <img 
                  src={uploadedImageUrl} 
                  alt="업로드된 이미지" 
                  className="w-48 h-48 object-cover rounded-2xl mx-auto border-4 border-purple-300 shadow-2xl"
                />
              </div>
              
              <p className="text-purple-200 mb-6 text-lg">
                {userName}님의 이미지 업로드가 완료되었습니다!<br/>
                이제 다른 도전자들과 미모 대결을 시작해보세요!<br/>
                <span className="text-sm text-purple-300">※ 이미지 분석은 대결 시점에 진행됩니다</span>
              </p>
              
              <button
                onClick={goToBattle}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                ⚔️ 미모 대결 시작하기 ⚔️
              </button>
            </div>
          </div>
        )}
      </div>
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