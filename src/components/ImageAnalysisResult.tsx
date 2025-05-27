import { Analysis } from '../types';

interface ImageAnalysisResultProps {
  analysis: Analysis;
  loading?: boolean;
}

export default function ImageAnalysisResult({ 
  analysis, 
  loading = false 
}: ImageAnalysisResultProps) {
  if (loading) {
    return (
      <div className="p-6 rounded-2xl backdrop-blur-sm bg-purple-900/30 border border-purple-400/30 shadow-xl animate-pulse">
        <div className="h-6 bg-purple-800/50 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-purple-800/50 rounded w-5/6"></div>
          <div className="h-4 bg-purple-800/50 rounded"></div>
          <div className="h-4 bg-purple-800/50 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-yellow-400 to-pink-400';
    if (score >= 6) return 'from-purple-400 to-pink-300';
    if (score >= 4) return 'from-blue-400 to-purple-400';
    return 'from-indigo-400 to-blue-400';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 9) return '✨';
    if (score >= 7) return '🌟';
    if (score >= 5) return '⭐';
    return '💫';
  };
  
  return (
    <div className="p-6 rounded-2xl bg-purple-900/30 backdrop-blur-sm border border-purple-400/30 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
          마법 분석 결과
        </h3>
        <div className="bg-gradient-to-r from-yellow-400/20 to-pink-400/20 px-4 py-2 rounded-full backdrop-blur-sm border border-purple-400/30">
          <span className="text-sm font-bold text-yellow-300">
            총 마법력: {analysis.averageScore.toFixed(1)}
          </span>
        </div>
      </div>
      
      {/* 전체 마법력 게이지 */}
      <div className="mb-8">
        <div className="flex justify-between mb-3 items-center">
          <span className="text-lg font-serif text-purple-100">✨ 아름다움의 마법력 ✨</span>
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            {analysis.averageScore.toFixed(1)} / 10
          </span>
        </div>
        <div className="relative">
          <div className="overflow-hidden h-8 rounded-full bg-purple-800/30 backdrop-blur-sm border border-purple-400/30">
            <div
              style={{ width: `${analysis.averageScore * 10}%` }}
              className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.averageScore)} transition-all duration-1000 ease-out relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-purple-900">{getScoreEmoji(analysis.averageScore)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 각 항목별 상세 분석 */}
      <div className="space-y-5">
        {/* 황금비율 점수 */}
        <div className="bg-purple-800/20 rounded-xl p-4 backdrop-blur-sm border border-purple-400/20">
          <div className="flex justify-between mb-2 items-center">
            <span className="text-sm font-serif text-yellow-300">👑 황금비율의 축복</span>
            <span className="text-sm font-bold text-purple-100">{analysis.goldenRatio} / 10</span>
          </div>
          <div className="relative mb-2">
            <div className="overflow-hidden h-3 rounded-full bg-purple-700/30">
              <div
                style={{ width: `${analysis.goldenRatio * 10}%` }}
                className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.goldenRatio)} transition-all duration-700`}
              />
            </div>
          </div>
          <p className="text-xs text-purple-200 italic">{analysis.goldenRatioDesc || "얼굴의 비율이 완벽한 조화를 이루고 있습니다."}</p>
        </div>
        
        {/* 이목구비 정밀도 */}
        <div className="bg-purple-800/20 rounded-xl p-4 backdrop-blur-sm border border-purple-400/20">
          <div className="flex justify-between mb-2 items-center">
            <span className="text-sm font-serif text-yellow-300">💎 이목구비의 조화</span>
            <span className="text-sm font-bold text-purple-100">{analysis.facialFeatures} / 10</span>
          </div>
          <div className="relative mb-2">
            <div className="overflow-hidden h-3 rounded-full bg-purple-700/30">
              <div
                style={{ width: `${analysis.facialFeatures * 10}%` }}
                className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.facialFeatures)} transition-all duration-700`}
              />
            </div>
          </div>
          <p className="text-xs text-purple-200 italic">{analysis.facialFeaturesDesc || "눈, 코, 입이 완벽한 균형을 이루고 있습니다."}</p>
        </div>
        
        {/* 피부 텍스처 */}
        <div className="bg-purple-800/20 rounded-xl p-4 backdrop-blur-sm border border-purple-400/20">
          <div className="flex justify-between mb-2 items-center">
            <span className="text-sm font-serif text-yellow-300">🌸 피부의 광채</span>
            <span className="text-sm font-bold text-purple-100">{analysis.skinTexture} / 10</span>
          </div>
          <div className="relative mb-2">
            <div className="overflow-hidden h-3 rounded-full bg-purple-700/30">
              <div
                style={{ width: `${analysis.skinTexture * 10}%` }}
                className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.skinTexture)} transition-all duration-700`}
              />
            </div>
          </div>
          <p className="text-xs text-purple-200 italic">{analysis.skinTextureDesc || "빛나는 피부가 아름다움을 더합니다."}</p>
        </div>
        
        {/* 분위기 */}
        <div className="bg-purple-800/20 rounded-xl p-4 backdrop-blur-sm border border-purple-400/20">
          <div className="flex justify-between mb-2 items-center">
            <span className="text-sm font-serif text-yellow-300">🌟 매혹의 아우라</span>
            <span className="text-sm font-bold text-purple-100">{analysis.impressiveness} / 10</span>
          </div>
          <div className="relative mb-2">
            <div className="overflow-hidden h-3 rounded-full bg-purple-700/30">
              <div
                style={{ width: `${analysis.impressiveness * 10}%` }}
                className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.impressiveness)} transition-all duration-700`}
              />
            </div>
          </div>
          <p className="text-xs text-purple-200 italic">{analysis.impressivenessDesc || "특별한 매력이 느껴집니다."}</p>
        </div>
        
        {/* 볼매 지수 */}
        <div className="bg-purple-800/20 rounded-xl p-4 backdrop-blur-sm border border-purple-400/20">
          <div className="flex justify-between mb-2 items-center">
            <span className="text-sm font-serif text-yellow-300">💖 점점 빠져드는 매력</span>
            <span className="text-sm font-bold text-purple-100">{analysis.growingCharm} / 10</span>
          </div>
          <div className="relative mb-2">
            <div className="overflow-hidden h-3 rounded-full bg-purple-700/30">
              <div
                style={{ width: `${analysis.growingCharm * 10}%` }}
                className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.growingCharm)} transition-all duration-700`}
              />
            </div>
          </div>
          <p className="text-xs text-purple-200 italic">{analysis.growingCharmDesc || "볼수록 매력적인 얼굴입니다."}</p>
        </div>
      </div>
      
      {analysis.rank && (
        <div className="mt-6 flex justify-center">
          <div className="bg-gradient-to-r from-yellow-400 to-pink-400 p-0.5 rounded-full">
            <div className="bg-purple-900 rounded-full px-5 py-2">
              <span className="text-sm font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                왕국 내 순위: {analysis.rank}위
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
} 