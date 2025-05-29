'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Header from '@/src/components/Header';
import { analyzeImage, analyzeImageSolo, compareImages, compareMultipleImages } from '@/src/lib/gemini';
import { parseAnalysisResult, parseSoloAnalysisResult, parseComparisonResult, parseMultipleComparisonResult } from '@/src/lib/parseUtils';
import { saveSimulationBattleResult, saveMultiSimulationResult } from '@/src/lib/firebaseService';
import { v4 as uuidv4 } from 'uuid';
import type { Analysis } from '@/src/types';

interface ImageData {
  id: string;
  file: File;
  preview: string;
  userName: string;
  analysis?: Analysis & { rank?: number };
  gender: 'male' | 'female' | 'unknown';
}

export default function SimulationPage() {
  const router = useRouter();
  const [participantCount, setParticipantCount] = useState<number>(2); // 기본 2명
  const [participants, setParticipants] = useState<ImageData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'select' | 'upload' | 'processing'>('select');

  // 이미지 업로드 핸들러 (특정 슬롯용)
  const handleImageUpload = useCallback((index: number) => {
    return (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setParticipants(prev => prev.map((p, i) => 
          i === index ? { ...p, file, preview } : p
        ));
      }
    };
  }, []);

  // 최대 4개의 dropzone을 미리 생성 (Hook 규칙 준수)
  const dropzone1 = useDropzone({
    onDrop: handleImageUpload(0),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  });

  const dropzone2 = useDropzone({
    onDrop: handleImageUpload(1),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  });

  const dropzone3 = useDropzone({
    onDrop: handleImageUpload(2),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  });

  const dropzone4 = useDropzone({
    onDrop: handleImageUpload(3),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  });

  // dropzones 배열
  const dropzones = [dropzone1, dropzone2, dropzone3, dropzone4];

  // 인원수 선택
  const handleParticipantCountSelect = (count: number) => {
    setParticipantCount(count);
    setParticipants(Array(count).fill(null).map((_, index) => ({
      id: uuidv4(),
      file: null as any,
      preview: '',
      userName: `참가자 ${index + 1}`,
      gender: 'unknown' as const
    })));
    setCurrentStep('upload');
  };

  // 참가자 정보 업데이트
  const updateParticipant = (index: number, field: 'userName' | 'gender', value: string) => {
    setParticipants(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    ));
  };

  // 분석 및 대결 진행
  const handleAnalyzeAndBattle = async () => {
    const validParticipants = participants.filter(p => p.file);
    
    if (validParticipants.length === 0) {
      setError('최소 1명의 이미지를 업로드해주세요.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setCurrentStep('processing');
      setError(null);

      if (participantCount === 1) {
        // 1명 솔로 분석
        const participant = validParticipants[0];
        const analysisResult = await analyzeImageSolo(participant.file);
        const analysis = parseSoloAnalysisResult(analysisResult);
        
        // 솔로 분석 결과 저장
        const result = await saveMultiSimulationResult(
          [{
            id: participant.id,
            userName: participant.userName,
            imageUrl: participant.preview,
            analysis: { ...analysis, rank: 1 },
            gender: participant.gender
          }],
          analysisResult,
          analysis.description
        );

        router.push(`/simulation/result/${result.id}`);
        
      } else if (participantCount === 2) {
        // 2명 기존 방식 유지
        const [participant1, participant2] = validParticipants;
        
        // 개별 분석
        const [analysis1Result, analysis2Result] = await Promise.all([
          analyzeImage(participant1.file),
          analyzeImage(participant2.file)
        ]);

        const analysis1 = parseAnalysisResult(analysis1Result);
        const analysis2 = parseAnalysisResult(analysis2Result);

        // 백업 분석 점수 적용
        const validateAndBackupAnalysis = (analysis: any) => {
          if (analysis.averageScore === 0) {
            return {
              goldenRatio: Math.random() * 3 + 5,
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
          return analysis;
        };

        const validatedAnalysis1 = validateAndBackupAnalysis(analysis1);
        const validatedAnalysis2 = validateAndBackupAnalysis(analysis2);

        // 비교 분석
        const comparisonResult = await compareImages(participant1.file, participant2.file);
        const parsedResult = parseComparisonResult(comparisonResult);

        const updatedAnalysis1 = { ...validatedAnalysis1, ...parsedResult.image1Analysis };
        const updatedAnalysis2 = { ...validatedAnalysis2, ...parsedResult.image2Analysis };

        // 승자 결정
        const winner = updatedAnalysis1.averageScore >= updatedAnalysis2.averageScore 
          ? { ...participant1, analysis: updatedAnalysis1 }
          : { ...participant2, analysis: updatedAnalysis2 };

        // 기존 2명 시뮬레이션 저장 방식 사용
        const battleResult = await saveSimulationBattleResult(
          {
            id: participant1.id,
            userName: participant1.userName,
            imageUrl: participant1.preview,
            analysis: updatedAnalysis1,
            gender: participant1.gender
          },
          {
            id: participant2.id,
            userName: participant2.userName,
            imageUrl: participant2.preview,
            analysis: updatedAnalysis2,
            gender: participant2.gender
          },
          winner.id,
          comparisonResult
        );

        router.push(`/simulation/result/${battleResult.id}`);
        
      } else {
        // 3-4명 다중 비교
        const analysisResult = await compareMultipleImages(validParticipants.map(p => p.file));
        const parsedResult = parseMultipleComparisonResult(analysisResult, validParticipants.length);
        
        // 분석 결과를 참가자들에게 매핑
        const participantsWithAnalysis = validParticipants.map((participant, index) => {
          const analysis = parsedResult.participants[index] || {
            goldenRatio: Math.random() * 3 + 5,
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
            description: '분석 중 일시적인 오류가 발생했습니다',
            rank: index + 1
          };

          return {
            id: participant.id,
            userName: participant.userName,
            imageUrl: participant.preview,
            analysis,
            gender: participant.gender
          };
        });

        // 다중 시뮬레이션 결과 저장
        const result = await saveMultiSimulationResult(
          participantsWithAnalysis,
          analysisResult,
          parsedResult.verdict
        );

        router.push(`/simulation/result/${result.id}`);
      }
      
    } catch (err) {
      console.error('시뮬레이션 진행 중 오류:', err);
      setError('시뮬레이션 진행 중 오류가 발생했습니다. 다시 시도해주세요.');
      setCurrentStep('upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 초기화
  const handleReset = () => {
    setParticipants([]);
    setCurrentStep('select');
    setError(null);
    setParticipantCount(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-4">
            🔬 시뮬레이션 대결
          </h1>
          <p className="text-purple-200 text-lg">
            1명부터 4명까지! 원하는 인원으로 AI 대결을 시뮬레이션해보세요!
          </p>
          <p className="text-purple-300 text-sm mt-2">
            ※ 시뮬레이션 결과는 랭킹에 영향을 주지 않습니다.
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        {/* 인원수 선택 단계 */}
        {currentStep === 'select' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 mb-8">
              <h2 className="text-2xl font-bold text-purple-200 mb-6 text-center">
                참가자 수를 선택하세요
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => handleParticipantCountSelect(count)}
                    className="group relative p-6 rounded-xl border-2 border-purple-400/50 bg-purple-700/20 hover:border-purple-400 hover:bg-purple-500/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">
                        {count === 1 ? '👤' : count === 2 ? '👥' : count === 3 ? '👤👤👤' : '👤👤👤👤'}
                      </div>
                      <div className="text-xl font-bold text-purple-200">{count}명</div>
                      <div className="text-sm text-purple-300 mt-2">
                        {count === 1 ? '개인 분석' : count === 2 ? '1 vs 1 대결' : `${count}명 토너먼트`}
                      </div>
                    </div>
                    
                    {/* 호버 효과 */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-transparent to-purple-400/20 animate-pulse" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 이미지 업로드 단계 */}
        {currentStep === 'upload' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-200">
                {participantCount}명 시뮬레이션 - 이미지 업로드
              </h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                다시 선택
              </button>
            </div>
            
            <div className={`grid gap-6 ${
              participantCount === 1 ? 'grid-cols-1 max-w-md mx-auto' :
              participantCount === 2 ? 'grid-cols-1 md:grid-cols-2' :
              participantCount === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {participants.map((participant, index) => {
                const dropzone = dropzones[index];
                return (
                  <div key={participant.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                    <h3 className="text-lg font-bold text-purple-200 mb-4 text-center">
                      참가자 {index + 1}
                    </h3>
                    
                    <div
                      {...dropzone.getRootProps()}
                      className={`
                        border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                        ${dropzone.isDragActive 
                          ? 'border-purple-400 bg-purple-400/20' 
                          : 'border-purple-400/50 hover:border-purple-400 hover:bg-purple-400/10'
                        }
                      `}
                    >
                      <input {...dropzone.getInputProps()} />
                      {participant.preview ? (
                        <div className="space-y-4">
                          <img 
                            src={participant.preview} 
                            alt={`참가자 ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg mx-auto"
                          />
                          <p className="text-purple-200 text-sm">클릭하여 변경</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-4xl">📸</div>
                          <p className="text-purple-200 text-sm">
                            {dropzone.isDragActive ? '이미지를 놓아주세요' : '이미지를 업로드하세요'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      <input
                        type="text"
                        value={participant.userName}
                        onChange={(e) => updateParticipant(index, 'userName', e.target.value)}
                        className="w-full px-3 py-2 bg-purple-800/50 border border-purple-400/30 rounded-lg text-white placeholder-purple-300 text-sm"
                        placeholder="이름 입력"
                      />
                      <select
                        value={participant.gender}
                        onChange={(e) => updateParticipant(index, 'gender', e.target.value)}
                        className="w-full px-3 py-2 bg-purple-800/50 border border-purple-400/30 rounded-lg text-white text-sm"
                      >
                        <option value="unknown">성별 선택</option>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 시작 버튼 */}
            <div className="text-center mt-8">
              <button
                onClick={handleAnalyzeAndBattle}
                disabled={participants.filter(p => p.file).length === 0 || isAnalyzing}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all shadow-lg disabled:cursor-not-allowed"
              >
                {isAnalyzing ? '분석 중...' : `🔍 ${participantCount}명 AI 분석 시작`}
              </button>
            </div>
          </div>
        )}

        {/* 처리 중 단계 */}
        {currentStep === 'processing' && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
              {/* 메인 로딩 애니메이션 */}
              <div className="relative mb-8">
                <div className="w-40 h-40 mx-auto relative">
                  <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full animate-spin">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                  <div className="absolute inset-4 border-4 border-pink-400/30 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '2s'}}>
                    <div className="w-3 h-3 bg-pink-400 rounded-full absolute -top-1.5 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-pulse">🔬</div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-purple-200 mb-6">
                🤖 {participantCount}명 AI 분석 진행 중!
              </h3>
              
              {/* 참가자 미리보기 */}
              <div className="flex justify-center items-center flex-wrap gap-4 mt-8">
                {participants.filter(p => p.file).map((participant, index) => (
                  <div key={participant.id} className="text-center">
                    <div className="relative">
                      <img 
                        src={participant.preview} 
                        alt={participant.userName} 
                        className="w-16 h-16 object-cover rounded-full border-2 border-purple-400 animate-pulse"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: `${index * 0.2}s`}}></div>
                    </div>
                    <p className="text-purple-300 mt-1 text-xs">{participant.userName}</p>
                  </div>
                ))}
              </div>

              <div className="bg-purple-800/50 rounded-lg p-4 mt-6">
                <p className="text-purple-100 text-sm italic">
                  {participantCount === 1 
                    ? "마법의 거울이 깊이 있는 개인 분석을 진행하고 있습니다... ✨"
                    : participantCount === 2 
                    ? "두 참가자의 치열한 대결이 진행되고 있습니다... ⚔️"
                    : `${participantCount}명의 참가자들이 치열한 순위 경쟁을 벌이고 있습니다... 🏆`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 