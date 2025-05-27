/**
 * 이미지 분석 및 비교 결과를 파싱하기 위한 유틸리티 함수들
 */

// 점수와 설명을 추출하는 정규식 패턴
const scorePatterns = {
  goldenRatio: /황금비율 점수: (\d+(?:\.\d+)?)점\s*\n([^\n]+)/,
  facialFeatures: /이목구비 정밀도: (\d+(?:\.\d+)?)점\s*\n([^\n]+)/,
  skinTexture: /피부 텍스처: (\d+(?:\.\d+)?)점\s*\n([^\n]+)/,
  impressiveness: /분위기: (\d+(?:\.\d+)?)점\s*\n([^\n]+)/,
  growingCharm: /볼매 지수: (\d+(?:\.\d+)?)점\s*\n([^\n]+)/,
  averageScore: /평균 점수: (\d+(?:\.\d+)?)점/
};

// 페르소나 추출 정규식 패턴
const personaPatterns = {
  singlePersona: /\*\*페르소나:\*\*\s*\n(.+)/,
  comparisonPersona: /\*\*페르소나\*\*\s*\n\* 첫 번째 이미지: ([^\n]+)\s*\n\* 두 번째 이미지: ([^\n]+)/
};

// 승자 및 최종 판정 추출 정규식 패턴
const resultPatterns = {
  winner: /\*\*최종 승자: (.+)\*\*/,
  verdict: /\*\*최종 판정\*\*\s*\n([^*]+)/
};

// 이미지 분석 결과에서 평균 점수 추출 정규식
const averageScorePatterns = {
  image1: /첫 번째 이미지: (\d+(?:\.\d+)?)점/,
  image2: /두 번째 이미지: (\d+(?:\.\d+)?)점/
};

/**
 * 단일 이미지 분석 결과를 파싱하는 함수
 */
export function parseAnalysisResult(analysisText: string) {
  const analysis = {
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

  // 각 항목별 점수와 설명 추출
  for (const [key, pattern] of Object.entries(scorePatterns)) {
    const match = analysisText.match(pattern);
    if (match) {
      // @ts-ignore - 동적 속성 할당
      analysis[key] = parseFloat(match[1]);
      
      // 설명이 있는 항목인 경우 설명도 저장
      if (match[2] && key !== 'averageScore') {
        // @ts-ignore - 동적 속성 할당
        analysis[`${key}Desc`] = match[2].trim();
      }
    }
  }

  // 페르소나 추출
  const personaMatch = analysisText.match(personaPatterns.singlePersona);
  if (personaMatch) {
    analysis.persona = personaMatch[1].trim();
  }

  return analysis;
}

/**
 * 두 이미지 비교 결과를 파싱하는 함수
 */
export function parseComparisonResult(comparisonText: string) {
  const sections = comparisonText.split('**두 번째 이미지 분석**');
  const image1AnalysisText = sections[0];
  const image2AnalysisText = sections.length > 1 ? sections[1] : '';

  // 첫 번째 이미지 분석 결과 파싱
  const image1Analysis = {
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

  // 두 번째 이미지 분석 결과 파싱
  const image2Analysis = {
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

  // 첫 번째 이미지 각 항목별 점수와 설명 추출
  for (const [key, pattern] of Object.entries(scorePatterns)) {
    const match = image1AnalysisText.match(pattern);
    if (match) {
      // @ts-ignore - 동적 속성 할당
      image1Analysis[key] = parseFloat(match[1]);
      
      // 설명이 있는 항목인 경우 설명도 저장
      if (match[2] && key !== 'averageScore') {
        // @ts-ignore - 동적 속성 할당
        image1Analysis[`${key}Desc`] = match[2].trim();
      }
    }
  }

  // 두 번째 이미지 각 항목별 점수와 설명 추출
  for (const [key, pattern] of Object.entries(scorePatterns)) {
    const match = image2AnalysisText.match(pattern);
    if (match) {
      // @ts-ignore - 동적 속성 할당
      image2Analysis[key] = parseFloat(match[1]);
      
      // 설명이 있는 항목인 경우 설명도 저장
      if (match[2] && key !== 'averageScore') {
        // @ts-ignore - 동적 속성 할당
        image2Analysis[`${key}Desc`] = match[2].trim();
      }
    }
  }

  // 평균 점수 추출 (전체 텍스트에서 추출)
  const image1ScoreMatch = comparisonText.match(averageScorePatterns.image1);
  const image2ScoreMatch = comparisonText.match(averageScorePatterns.image2);

  if (image1ScoreMatch) {
    image1Analysis.averageScore = parseFloat(image1ScoreMatch[1]);
  }

  if (image2ScoreMatch) {
    image2Analysis.averageScore = parseFloat(image2ScoreMatch[1]);
  }

  // 페르소나 추출
  const personaMatch = comparisonText.match(personaPatterns.comparisonPersona);
  if (personaMatch) {
    image1Analysis.persona = personaMatch[1].trim();
    image2Analysis.persona = personaMatch[2].trim();
  }

  // 최종 판정 추출
  const verdictMatch = comparisonText.match(resultPatterns.verdict);
  if (verdictMatch) {
    const verdict = verdictMatch[1].trim();
    image1Analysis.description = verdict;
    image2Analysis.description = verdict;
  }

  return {
    image1Analysis,
    image2Analysis
  };
} 