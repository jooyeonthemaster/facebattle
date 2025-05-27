'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/src/components/Header';
import ImageUploader from '@/src/components/ImageUploader';
import { createEmptyAnalysis } from '@/src/lib/gemini';
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
  const { setCurrentImage } = useAppStore();
  
  useEffect(() => {
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
  
  // 이미지 업로드 함수 (분석 제거)
  const handleUploadImage = async () => {
    if (!file || !selectedGender || !userName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // 사용자 정보 생성 (입력받은 이름 사용)
      const user = {
        id: 'user-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000),
        name: userName.trim(),
        email: 'anonymous@example.com',
        createdAt: new Date()
      };
      
      // 빈 분석 객체 생성 (배틀 시점에 분석 수행)
      const emptyAnalysis = createEmptyAnalysis();
      
      // Firebase에 이미지 업로드 및 저장 (분석 없이)
      const uploadedImage = await uploadImage(file, user, emptyAnalysis, selectedGender);
      
      // 저장된 이미지 정보를 전역 상태에 저장
      setCurrentImage(uploadedImage);
      
      // 업로드 완료 상태로 변경
      setUploadComplete(true);
      setUploadedImageUrl(uploadedImage.imageUrl);
      
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
      
      {/* 간단한 배경 패턴으로 대체 */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 50px 50px'
        }} />
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
                shadow-xl transform transition-all duration-200
                ${isProcessing || !userName.trim()
                  ? 'bg-purple-600/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-2xl active:scale-95'
                }
              `}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  마법의 거울에 저장 중...
                </div>
              ) : (
                '🔮 마법의 거울에 저장하기'
              )}
            </button>
          </div>
        )}
        
        {/* 업로드 완료 후 배틀 시작 버튼 */}
        {uploadComplete && (
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 border-2 border-green-400/50 shadow-2xl">
              <div className="text-4xl sm:text-5xl mb-4">✨</div>
              <h3 className="text-xl sm:text-2xl font-serif text-green-300 mb-4">
                마법의 거울에 저장되었습니다!
              </h3>
              <p className="text-purple-200 mb-6 text-sm sm:text-base">
                이제 다른 도전자들과의 미모 대결을 시작할 수 있습니다.
              </p>
              
              <button
                onClick={goToBattle}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-serif text-lg sm:text-xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                ⚔️ 미모 대결 시작하기
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