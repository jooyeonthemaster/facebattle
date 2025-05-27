import { Analysis, Image as ImageType } from '../types';
import Image from 'next/image';

interface BattleResultProps {
  image1: ImageType;
  image2: ImageType;
  winner: ImageType;
  resultText: string;
  loading?: boolean;
}

export default function BattleResult({
  image1,
  image2,
  winner,
  resultText,
  loading = false
}: BattleResultProps) {
  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="p-8 rounded-3xl backdrop-blur-sm bg-purple-900/30 border border-purple-400/30 shadow-2xl animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="aspect-square bg-purple-800/50 rounded-full"></div>
            <div className="h-5 bg-purple-800/50 rounded mt-4 w-1/2 mx-auto"></div>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="h-6 w-16 bg-purple-800/50 rounded"></div>
          </div>
          <div className="flex-1">
            <div className="aspect-square bg-purple-800/50 rounded-full"></div>
            <div className="h-5 bg-purple-800/50 rounded mt-4 w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const isImage1Winner = image1.id === winner.id;
  const winnerImage = isImage1Winner ? image1 : image2;
  const loserImage = isImage1Winner ? image2 : image1;
  const scoreDifference = (winnerImage.analysis.averageScore - loserImage.analysis.averageScore).toFixed(1);
  
  // 승패 멘트 생성
  const getResultComment = () => {
    const diff = parseFloat(scoreDifference);
    if (diff >= 3) return '압도적인 아름다움';
    if (diff >= 2) return '확실한 우위';
    if (diff >= 1) return '근소한 차이';
    return '거의 동등한 아름다움';
  };
  
  // 페르소나와 최종 판정 추출
  const extractPersonasAndVerdict = () => {
    const personas = {
      first: "",
      second: ""
    };
    let verdict = "";
    
    // 페르소나 추출 - s 플래그 대신 [\s\S]* 패턴 사용
    const personaRegex = /\*\*페르소나\*\*\s*\n\*\s*첫 번째 이미지:\s*([\s\S]+?)\s*\n\*\s*두 번째 이미지:\s*([\s\S]+?)(?:\s*\n|$)/;
    const personaMatch = resultText.match(personaRegex);
    
    if (personaMatch) {
      personas.first = personaMatch[1].trim();
      personas.second = personaMatch[2].trim();
    }
    
    // 최종 판정 추출
    const verdictRegex = /\*\*최종 판정\*\*\s*\n([\s\S]+?)(?:\n\n|$)/;
    const verdictMatch = resultText.match(verdictRegex);
    
    if (verdictMatch) {
      verdict = verdictMatch[1].trim();
    }
    
    return {
      personas,
      verdict
    };
  };
  
  const { personas, verdict } = extractPersonasAndVerdict();
  
  return (
    <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-purple-900/40 to-purple-800/30 backdrop-blur-sm shadow-2xl border border-purple-400/30">
      <div className="bg-gradient-to-r from-yellow-400/20 to-pink-400/20 py-4 px-6 backdrop-blur-sm border-b border-purple-400/30">
        <h2 className="text-3xl font-serif text-center text-purple-100">
          ✨ 마법의 거울의 심판 ✨
        </h2>
      </div>
      
      <div className="p-8">
        {/* 대결 이미지 섹션 */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch mb-10">
          <div className={`relative flex-1 ${isImage1Winner ? 'order-1' : 'order-3 md:order-1'}`}>
            <div className="relative">
              {/* 승자 왕관 */}
              {isImage1Winner && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="text-5xl animate-bounce">👑</div>
                </div>
              )}
              
              <div className={`
                relative aspect-square 
                ${isImage1Winner ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-purple-900/50' : 'opacity-75'}
                rounded-full overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105
              `}>
                <Image
                  src={image1.imageUrl}
                  alt={`${image1.userName}의 이미지`}
                  fill
                  className="object-cover"
                />
                {isImage1Winner && (
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 via-transparent to-transparent"></div>
                )}
                {!isImage1Winner && (
                  <div className="absolute inset-0 bg-black/30"></div>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <p className="font-serif text-xl text-purple-100">{image1.userName}</p>
                <div className="flex justify-center items-center mt-2">
                  <div className={`px-4 py-2 rounded-full ${isImage1Winner ? 'bg-gradient-to-r from-yellow-400 to-pink-400' : 'bg-purple-700/50'}`}>
                    <span className={`text-sm font-bold ${isImage1Winner ? 'text-purple-900' : 'text-purple-200'}`}>
                      마법 점수: {image1.analysis.averageScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                {/* 페르소나 설명 */}
                <div className="mt-4 px-4 py-3 bg-purple-800/30 rounded-2xl backdrop-blur-sm border border-purple-400/30">
                  <p className="text-sm italic text-purple-200 font-serif">
                    "{personas.first}"
                  </p>
                </div>
                
                {isImage1Winner && (
                  <div className="mt-3">
                    <span className="text-yellow-300 font-serif text-lg">✨ 승리 ✨</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* VS 섹션 */}
          <div className="flex flex-col items-center justify-center py-4 order-2 md:px-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
              </div>
              <span className="relative text-3xl font-serif text-purple-200">VS</span>
            </div>
          </div>
          
          <div className={`relative flex-1 ${!isImage1Winner ? 'order-1 md:order-3' : 'order-3'}`}>
            <div className="relative">
              {/* 승자 왕관 */}
              {!isImage1Winner && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="text-5xl animate-bounce">👑</div>
                </div>
              )}
              
              <div className={`
                relative aspect-square 
                ${!isImage1Winner ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-purple-900/50' : 'opacity-75'}
                rounded-full overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105
              `}>
                <Image
                  src={image2.imageUrl}
                  alt={`${image2.userName}의 이미지`}
                  fill
                  className="object-cover"
                />
                {!isImage1Winner && (
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 via-transparent to-transparent"></div>
                )}
                {isImage1Winner && (
                  <div className="absolute inset-0 bg-black/30"></div>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <p className="font-serif text-xl text-purple-100">{image2.userName}</p>
                <div className="flex justify-center items-center mt-2">
                  <div className={`px-4 py-2 rounded-full ${!isImage1Winner ? 'bg-gradient-to-r from-yellow-400 to-pink-400' : 'bg-purple-700/50'}`}>
                    <span className={`text-sm font-bold ${!isImage1Winner ? 'text-purple-900' : 'text-purple-200'}`}>
                      마법 점수: {image2.analysis.averageScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                {/* 페르소나 설명 */}
                <div className="mt-4 px-4 py-3 bg-purple-800/30 rounded-2xl backdrop-blur-sm border border-purple-400/30">
                  <p className="text-sm italic text-purple-200 font-serif">
                    "{personas.second}"
                  </p>
                </div>
                
                {!isImage1Winner && (
                  <div className="mt-3">
                    <span className="text-yellow-300 font-serif text-lg">✨ 승리 ✨</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 최종 결과 배너 */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-2xl p-1 shadow-xl backdrop-blur-sm">
          <div className="bg-purple-900/50 rounded-xl p-6">
            <div className="text-center">
              <h3 className="text-2xl font-serif text-yellow-300 mb-2">
                🏆 {winner.userName}님이 더 아름답습니다 🏆
              </h3>
              <div className="flex justify-center items-center gap-6 mt-4">
                <div className="text-center">
                  <p className="text-purple-300 text-sm">점수 차이</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                    +{scoreDifference}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-purple-300 text-sm">판정</p>
                  <p className="text-xl font-serif text-yellow-300">{getResultComment()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 마법의 거울 판정문 */}
        <div className="mt-8 p-6 bg-purple-800/30 rounded-2xl backdrop-blur-sm border border-purple-400/30 shadow-xl">
          <div className="font-serif text-yellow-300 text-xl mb-4 text-center">📜 마법의 거울이 전하는 말 📜</div>
          <p className="whitespace-pre-line text-purple-100 leading-relaxed text-center font-serif">
            {verdict}
          </p>
        </div>
      </div>
      
      {/* 하단 안내문 */}
      <div className="bg-purple-800/20 py-3 px-6 text-center backdrop-blur-sm border-t border-purple-400/30">
        <p className="text-xs text-purple-300">✨ 마법의 거울은 재미를 위한 것입니다. 모든 사람은 각자의 아름다움을 가지고 있습니다 ✨</p>
      </div>
    </div>
  );
}