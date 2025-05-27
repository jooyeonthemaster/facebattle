'use client';

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

  return (
    <div className="space-y-6">
      {/* 점수 비교 차트 */}
      <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
        <h3 className="text-xl font-serif text-yellow-300 mb-6 text-center">
          📊 세부 항목별 점수 비교
        </h3>
        
        <div className="space-y-4">
          {analysisCategories.map((category) => {
            const currentScore = currentImage.analysis[category.key as keyof typeof currentImage.analysis] as number;
            const opponentScore = opponentImage.analysis[category.key as keyof typeof opponentImage.analysis] as number;
            const maxScore = Math.max(currentScore, opponentScore, 10);
            
            return (
              <div key={category.key} className="bg-purple-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-purple-100 font-medium">{category.name}</span>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded ${getScoreGrade(currentScore).bg} ${getScoreGrade(currentScore).color}`}>
                      {currentImage.userName}: {currentScore}점 ({getScoreGrade(currentScore).grade})
                    </span>
                    <span className={`px-2 py-1 rounded ${getScoreGrade(opponentScore).bg} ${getScoreGrade(opponentScore).color}`}>
                      {opponentImage.userName}: {opponentScore}점 ({getScoreGrade(opponentScore).grade})
                    </span>
                  </div>
                </div>
                
                {/* 점수 바 차트 */}
                <div className="space-y-2">
                  {/* 현재 사용자 */}
                  <div className="flex items-center space-x-3">
                    <div className="w-20 text-sm text-purple-200 truncate">{currentImage.userName}</div>
                    <div className="flex-1 bg-purple-700/50 rounded-full h-3 relative overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${category.color} transition-all duration-1000 relative`}
                        style={{ width: `${(currentScore / maxScore) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                    <div className="w-12 text-sm text-purple-200 text-right">{currentScore}</div>
                  </div>
                  
                  {/* 상대방 */}
                  <div className="flex items-center space-x-3">
                    <div className="w-20 text-sm text-purple-200 truncate">{opponentImage.userName}</div>
                    <div className="flex-1 bg-purple-700/50 rounded-full h-3 relative overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${category.color} opacity-70 transition-all duration-1000 relative`}
                        style={{ width: `${(opponentScore / maxScore) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                      </div>
                    </div>
                    <div className="w-12 text-sm text-purple-200 text-right">{opponentScore}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 종합 점수 비교 */}
      <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
        <h3 className="text-xl font-serif text-yellow-300 mb-6 text-center">
          🏆 종합 점수 비교
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 현재 사용자 */}
          <div className={`
            relative p-6 rounded-xl border-2 transition-all duration-300
            ${winnerImage.id === currentImage.id 
              ? 'border-yellow-400 bg-yellow-500/10 shadow-lg shadow-yellow-400/20' 
              : 'border-purple-400/50 bg-purple-800/30'
            }
          `}>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <img 
                  src={currentImage.imageUrl} 
                  alt={currentImage.userName}
                  className="w-full h-full object-cover rounded-full border-4 border-purple-400"
                />
                {winnerImage.id === currentImage.id && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">👑</div>
                )}
              </div>
              
              <h4 className="text-lg font-serif text-purple-100 mb-2">{currentImage.userName}</h4>
              
              {/* 종합 점수 원형 차트 */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
                  <span className="text-lg font-bold text-purple-100">
                    {currentImage.analysis.averageScore.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getScoreGrade(currentImage.analysis.averageScore).bg} ${getScoreGrade(currentImage.analysis.averageScore).color}`}>
                {getScoreGrade(currentImage.analysis.averageScore).grade}등급
              </div>
            </div>
          </div>

          {/* 상대방 */}
          <div className={`
            relative p-6 rounded-xl border-2 transition-all duration-300
            ${winnerImage.id === opponentImage.id 
              ? 'border-yellow-400 bg-yellow-500/10 shadow-lg shadow-yellow-400/20' 
              : 'border-purple-400/50 bg-purple-800/30'
            }
          `}>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <img 
                  src={opponentImage.imageUrl} 
                  alt={opponentImage.userName}
                  className="w-full h-full object-cover rounded-full border-4 border-purple-400"
                />
                {winnerImage.id === opponentImage.id && (
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">👑</div>
                )}
              </div>
              
              <h4 className="text-lg font-serif text-purple-100 mb-2">{opponentImage.userName}</h4>
              
              {/* 종합 점수 원형 차트 */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
                  <span className="text-lg font-bold text-purple-100">
                    {opponentImage.analysis.averageScore.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getScoreGrade(opponentImage.analysis.averageScore).bg} ${getScoreGrade(opponentImage.analysis.averageScore).color}`}>
                {getScoreGrade(opponentImage.analysis.averageScore).grade}등급
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 최종 판정 */}
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

      {/* 승자의 페르소나 */}
      {winnerImage.analysis.persona && (
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-pink-400/30">
          <h3 className="text-xl font-serif text-pink-300 mb-4 text-center">
            ✨ 승자의 페르소나
          </h3>
          <div className="text-center">
            <p className="text-purple-100 text-lg italic">
              "{winnerImage.analysis.persona}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 