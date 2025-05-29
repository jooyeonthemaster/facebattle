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
  // 다양한 가능한 구분자들을 시도
  let sections = comparisonText.split('**두 번째 이미지 분석**');
  if (sections.length === 1) {
    sections = comparisonText.split('두 번째 이미지 분석');
  }
  if (sections.length === 1) {
    sections = comparisonText.split('**두번째 이미지 분석**');
  }
  if (sections.length === 1) {
    sections = comparisonText.split('### 두 번째 이미지 분석');
  }
  
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

  // 더 관대한 정규식 패턴들
  const flexibleScorePatterns = {
    goldenRatio: [
      /황금비율 점수:?\s*(\d+(?:\.\d+)?)점?\s*\n([^\n]+)/i,
      /황금비율:?\s*(\d+(?:\.\d+)?)점?/i,
      /황금비율.*?(\d+(?:\.\d+)?)점/i
    ],
    facialFeatures: [
      /이목구비 정밀도:?\s*(\d+(?:\.\d+)?)점?\s*\n([^\n]+)/i,
      /이목구비:?\s*(\d+(?:\.\d+)?)점?/i,
      /이목구비.*?(\d+(?:\.\d+)?)점/i
    ],
    skinTexture: [
      /피부 텍스처:?\s*(\d+(?:\.\d+)?)점?\s*\n([^\n]+)/i,
      /피부:?\s*(\d+(?:\.\d+)?)점?/i,
      /피부.*?(\d+(?:\.\d+)?)점/i
    ],
    impressiveness: [
      /분위기:?\s*(\d+(?:\.\d+)?)점?\s*\n([^\n]+)/i,
      /분위기:?\s*(\d+(?:\.\d+)?)점?/i,
      /분위기.*?(\d+(?:\.\d+)?)점/i
    ],
    growingCharm: [
      /볼매 지수:?\s*(\d+(?:\.\d+)?)점?\s*\n([^\n]+)/i,
      /볼매:?\s*(\d+(?:\.\d+)?)점?/i,
      /볼매.*?(\d+(?:\.\d+)?)점/i
    ]
  };

  // 첫 번째 이미지 각 항목별 점수와 설명 추출 (여러 패턴 시도)
  for (const [key, patterns] of Object.entries(flexibleScorePatterns)) {
    let match = null;
    for (const pattern of patterns) {
      match = image1AnalysisText.match(pattern);
      if (match) break;
    }
    
    if (match) {
      // @ts-ignore - 동적 속성 할당
      image1Analysis[key] = parseFloat(match[1]);
      
      // 설명이 있는 경우 설명도 저장
      if (match[2]) {
        // @ts-ignore - 동적 속성 할당
        image1Analysis[`${key}Desc`] = match[2].trim();
      }
    }
  }

  // 두 번째 이미지 각 항목별 점수와 설명 추출 (여러 패턴 시도)
  for (const [key, patterns] of Object.entries(flexibleScorePatterns)) {
    let match = null;
    for (const pattern of patterns) {
      match = image2AnalysisText.match(pattern);
      if (match) break;
    }
    
    if (match) {
      // @ts-ignore - 동적 속성 할당
      image2Analysis[key] = parseFloat(match[1]);
      
      // 설명이 있는 경우 설명도 저장
      if (match[2]) {
        // @ts-ignore - 동적 속성 할당
        image2Analysis[`${key}Desc`] = match[2].trim();
      }
    }
  }

  // 평균 점수 추출 (다양한 패턴 시도)
  const avgScorePatterns = [
    /첫 번째 이미지:?\s*(\d+(?:\.\d+)?)점/i,
    /첫번째 이미지:?\s*(\d+(?:\.\d+)?)점/i,
    /첫번째:?\s*(\d+(?:\.\d+)?)점/i
  ];
  
  const avgScorePatterns2 = [
    /두 번째 이미지:?\s*(\d+(?:\.\d+)?)점/i,
    /두번째 이미지:?\s*(\d+(?:\.\d+)?)점/i,
    /두번째:?\s*(\d+(?:\.\d+)?)점/i
  ];

  let image1ScoreMatch = null;
  let image2ScoreMatch = null;

  for (const pattern of avgScorePatterns) {
    image1ScoreMatch = comparisonText.match(pattern);
    if (image1ScoreMatch) break;
  }

  for (const pattern of avgScorePatterns2) {
    image2ScoreMatch = comparisonText.match(pattern);
    if (image2ScoreMatch) break;
  }

  if (image1ScoreMatch) {
    image1Analysis.averageScore = parseFloat(image1ScoreMatch[1]);
  } else {
    // 평균 점수가 없으면 개별 점수들의 평균 계산
    const scores = [
      image1Analysis.goldenRatio,
      image1Analysis.facialFeatures,
      image1Analysis.skinTexture,
      image1Analysis.impressiveness,
      image1Analysis.growingCharm
    ].filter(score => score > 0);
    
    if (scores.length > 0) {
      image1Analysis.averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
  }

  if (image2ScoreMatch) {
    image2Analysis.averageScore = parseFloat(image2ScoreMatch[1]);
  } else {
    // 평균 점수가 없으면 개별 점수들의 평균 계산
    const scores = [
      image2Analysis.goldenRatio,
      image2Analysis.facialFeatures,
      image2Analysis.skinTexture,
      image2Analysis.impressiveness,
      image2Analysis.growingCharm
    ].filter(score => score > 0);
    
    if (scores.length > 0) {
      image2Analysis.averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
  }

  // 페르소나 추출 (다양한 패턴 시도)
  const personaPatterns = [
    /\*\*페르소나\*\*\s*\n\*\s*첫 번째 이미지:\s*([^\n]+)\s*\n\*\s*두 번째 이미지:\s*([^\n]+)/i,
    /페르소나\s*\n\*\s*첫 번째 이미지:\s*([^\n]+)\s*\n\*\s*두 번째 이미지:\s*([^\n]+)/i,
    /첫 번째 이미지:\s*([^\n]+)\s*\n.*?두 번째 이미지:\s*([^\n]+)/i
  ];

  let personaMatch = null;
  for (const pattern of personaPatterns) {
    personaMatch = comparisonText.match(pattern);
    if (personaMatch) break;
  }
  
  if (personaMatch) {
    image1Analysis.persona = personaMatch[1].trim();
    image2Analysis.persona = personaMatch[2].trim();
  }

  // 최종 판정 추출 (다양한 패턴 시도)
  const verdictPatterns = [
    /\*\*최종 판정\*\*\s*\n([^*]+)/i,
    /최종 판정\s*\n([^*]+)/i,
    /최종.*?\n(.*?)(?:\n\n|$)/i
  ];

  let verdictMatch = null;
  for (const pattern of verdictPatterns) {
    verdictMatch = comparisonText.match(pattern);
    if (verdictMatch) break;
  }
  
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