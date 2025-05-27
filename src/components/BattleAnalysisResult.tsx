'use client';

import { useState } from 'react';
import { Image as ImageType } from '@/src/types';

interface BattleAnalysisResultProps {
  currentImage: ImageType;
  opponentImage: ImageType;
  winnerImage: ImageType;
  analysisText: string;
}

// 분석 항목 정보
const analysisCategories = [
  { key: 'goldenRatio', name: '황금비율', icon: '📐', color: 'from-yellow-400 to-yellow-600' },
  { key: 'facialFeatures', name: '이목구비', icon: '👁️', color: 'from-blue-400 to-blue-600' },
  { key: 'skinTexture', name: '피부 텍스처', icon: '✨', color: 'from-pink-400 to-pink-600' },
  { key: 'impressiveness', name: '분위기', icon: '🌟', color: 'from-purple-400 to-purple-600' },
  { key: 'growingCharm', name: '볼매 지수', icon: '💖', color: 'from-red-400 to-red-600' },
];

// 점수에 따른 등급 계산
const getScoreGrade = (score: number) => {
  if (score >= 9) return { grade: 'S', color: 'text-yellow-300', bg: 'bg-yellow-500/20' };
  if (score >= 8) return { grade: 'A', color: 'text-green-300', bg: 'bg-green-500/20' };
  if (score >= 7) return { grade: 'B', color: 'text-blue-300', bg: 'bg-blue-500/20' };
  if (score >= 6) return { grade: 'C', color: 'text-purple-300', bg: 'bg-purple-500/20' };
  return { grade: 'D', color: 'text-gray-300', bg: 'bg-gray-500/20' };
};

// AI 응답에서 핵심 내용만 추출하는 함수
const extractKeyInsights = (text: string) => {
  // 불필요한 멘트들 제거
  const cleanText = text
    .replace(/네, 요청하신대로.*?작성해 드리겠습니다\./g, '')
    .replace(/디시인사이드 스타일로/g, '')
    .replace(/\*\*두 번째 이미지 분석\*\*/g, '')
    .replace(/\*\*첫 번째 이미지 분석\*\*/g, '')
    .trim();

  // 최종 판정 부분 추출
  const verdictMatch = cleanText.match(/\*\*최종 판정\*\*\s*\n([^*]+)/);
  const verdict = verdictMatch ? verdictMatch[1].trim() : '';

  // 승자 추출
  const winnerMatch = cleanText.match(/\*\*최종 승자: (.+)\*\*/);
  const winner = winnerMatch ? winnerMatch[1].trim() : '';

  return { verdict, winner };
};

export default function BattleAnalysisResult({ 
  currentImage, 
  opponentImage, 
  winnerImage, 
  analysisText 
}: BattleAnalysisResultProps) {
  const { verdict, winner } = extractKeyInsights(analysisText);
  const [showCurrentDetails, setShowCurrentDetails] = useState(false);
  const [showOpponentDetails, setShowOpponentDetails] = useState(false);

  return (
    <div className="space-y-6">
      {/* 최종 판정 - 맨 위로 이동 */}
      {verdict && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-400/50">
          <h3 className="text-xl font-serif text-yellow-300 mb-4 text-center">
            🔮 마법의 거울 최종 판정
          </h3>
          <div className="bg-purple-800/50 rounded-lg p-4">
            <p className="text-purple-100 leading-relaxed text-center">
              {verdict}
            </p>
          </div>
        </div>
      )}

      {/* 종합 점수 비교 - 가로 배치 */}
      <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
        <h3 className="text-xl font-serif text-yellow-300 mb-6 text-center">
          🏆 종합 점수 비교
        </h3>
        
        {/* 가로 배치로 변경 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* 현재 사용자 */}
          <div className={`
            relative p-6 rounded-xl border-2 transition-all duration-300 flex-1 max-w-sm
            ${winnerImage.id === currentImage.id 
              ? 'border-yellow-400 bg-yellow-500/10 shadow-lg shadow-yellow-400/20' 
              : 'border-purple-400/50 bg-purple-800/30'
            }
          `}>
            <div className="text-center">
              {/* 더 큰 이미지 */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 relative">
                <img 
                  src={currentImage.imageUrl} 
                  alt={currentImage.userName}
                  className="w-full h-full object-cover rounded-full border-4 border-purple-400"
                />
                {winnerImage.id === currentImage.id && (
                  <div className="absolute -top-2 -right-2 text-2xl sm:text-3xl animate-bounce">👑</div>
                )}
              </div>
              
              <h4 className="text-lg sm:text-xl font-serif text-purple-100 mb-2">{currentImage.userName}</h4>
              
              {/* 종합 점수 원형 차트 */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-4">
                <svg className="w-20 h-20 sm:w-28 sm:h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-purple-700/50"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(currentImage.analysis.averageScore / 10) * 251.2} 251.2`}
                    className={winnerImage.id === currentImage.id ? 'text-yellow-400' : 'text-purple-400'}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold text-purple-100">
                    {currentImage.analysis.averageScore.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className={`inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-bold ${getScoreGrade(currentImage.analysis.averageScore).bg} ${getScoreGrade(currentImage.analysis.averageScore).color}`}>
                {getScoreGrade(currentImage.analysis.averageScore).grade}등급
              </div>

              {/* 개별 페르소나 */}
              {currentImage.analysis.persona && (
                <div className="mt-4 bg-purple-700/30 rounded-lg p-3">
                  <h5 className="text-xs sm:text-sm font-serif text-pink-300 mb-2">✨ 페르소나</h5>
                  <p className="text-purple-100 text-xs sm:text-sm italic">
                    "{currentImage.analysis.persona}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* VS 표시 */}
          <div className="text-4xl sm:text-6xl font-bold text-yellow-300 animate-pulse">
            VS
          </div>

          {/* 상대방 */}
          <div className={`
            relative p-6 rounded-xl border-2 transition-all duration-300 flex-1 max-w-sm
            ${winnerImage.id === opponentImage.id 
              ? 'border-yellow-400 bg-yellow-500/10 shadow-lg shadow-yellow-400/20' 
              : 'border-purple-400/50 bg-purple-800/30'
            }
          `}>
            <div className="text-center">
              {/* 더 큰 이미지 */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 relative">
                <img 
                  src={opponentImage.imageUrl} 
                  alt={opponentImage.userName}
                  className="w-full h-full object-cover rounded-full border-4 border-purple-400"
                />
                {winnerImage.id === opponentImage.id && (
                  <div className="absolute -top-2 -right-2 text-2xl sm:text-3xl animate-bounce">👑</div>
                )}
              </div>
              
              <h4 className="text-lg sm:text-xl font-serif text-purple-100 mb-2">{opponentImage.userName}</h4>
              
              {/* 종합 점수 원형 차트 */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-4">
                <svg className="w-20 h-20 sm:w-28 sm:h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-purple-700/50"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(opponentImage.analysis.averageScore / 10) * 251.2} 251.2`}
                    className={winnerImage.id === opponentImage.id ? 'text-yellow-400' : 'text-purple-400'}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold text-purple-100">
                    {opponentImage.analysis.averageScore.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className={`inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-bold ${getScoreGrade(opponentImage.analysis.averageScore).bg} ${getScoreGrade(opponentImage.analysis.averageScore).color}`}>
                {getScoreGrade(opponentImage.analysis.averageScore).grade}등급
              </div>

              {/* 개별 페르소나 */}
              {opponentImage.analysis.persona && (
                <div className="mt-4 bg-purple-700/30 rounded-lg p-3">
                  <h5 className="text-xs sm:text-sm font-serif text-pink-300 mb-2">✨ 페르소나</h5>
                  <p className="text-purple-100 text-xs sm:text-sm italic">
                    "{opponentImage.analysis.persona}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 토글 가능한 세부 분석 - 현재 사용자 */}
      <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl border border-purple-400/30">
        <button
          onClick={() => setShowCurrentDetails(!showCurrentDetails)}
          className="w-full p-6 text-left hover:bg-purple-800/30 transition-colors rounded-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif text-yellow-300">
              📊 {currentImage.userName}님의 세부 분석
            </h3>
            <div className={`transform transition-transform ${showCurrentDetails ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>
        
        {showCurrentDetails && (
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {analysisCategories.map((category) => {
                const score = currentImage.analysis[category.key as keyof typeof currentImage.analysis] as number;
                const description = currentImage.analysis[`${category.key}Desc` as keyof typeof currentImage.analysis] as string;
                
                return (
                  <div key={category.key} className="bg-purple-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="text-purple-100 font-medium text-lg">{category.name}</span>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-base font-bold ${getScoreGrade(score).bg} ${getScoreGrade(score).color}`}>
                        {score}점 ({getScoreGrade(score).grade}등급)
                      </div>
                    </div>
                    
                    {/* 점수 바 */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-purple-700/50 rounded-full h-4 relative overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${category.color} transition-all duration-1000 relative`}
                            style={{ width: `${(score / 10) * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </div>
                        </div>
                        <div className="text-purple-200 text-sm font-medium">{score}/10</div>
                      </div>
                    </div>

                    {/* 세부 설명 */}
                    {description && (
                      <div className="bg-purple-700/20 rounded-lg p-3">
                        <p className="text-purple-200 text-sm leading-relaxed">
                          💬 {description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 토글 가능한 세부 분석 - 상대방 */}
      <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl border border-purple-400/30">
        <button
          onClick={() => setShowOpponentDetails(!showOpponentDetails)}
          className="w-full p-6 text-left hover:bg-purple-800/30 transition-colors rounded-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif text-yellow-300">
              📊 {opponentImage.userName}님의 세부 분석
            </h3>
            <div className={`transform transition-transform ${showOpponentDetails ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>
        
        {showOpponentDetails && (
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {analysisCategories.map((category) => {
                const score = opponentImage.analysis[category.key as keyof typeof opponentImage.analysis] as number;
                const description = opponentImage.analysis[`${category.key}Desc` as keyof typeof opponentImage.analysis] as string;
                
                return (
                  <div key={category.key} className="bg-purple-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="text-purple-100 font-medium text-lg">{category.name}</span>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-base font-bold ${getScoreGrade(score).bg} ${getScoreGrade(score).color}`}>
                        {score}점 ({getScoreGrade(score).grade}등급)
                      </div>
                    </div>
                    
                    {/* 점수 바 */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-purple-700/50 rounded-full h-4 relative overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${category.color} transition-all duration-1000 relative`}
                            style={{ width: `${(score / 10) * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </div>
                        </div>
                        <div className="text-purple-200 text-sm font-medium">{score}/10</div>
                      </div>
                    </div>

                    {/* 세부 설명 */}
                    {description && (
                      <div className="bg-purple-700/20 rounded-lg p-3">
                        <p className="text-purple-200 text-sm leading-relaxed">
                          💬 {description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 