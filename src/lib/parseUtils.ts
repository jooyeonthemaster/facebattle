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

/**
 * 솔로 이미지 분석 결과를 파싱하는 함수 (1명용)
 */
export function parseSoloAnalysisResult(analysisText: string) {
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

  // 각 항목별 점수와 설명 추출
  for (const [key, patterns] of Object.entries(flexibleScorePatterns)) {
    let match = null;
    for (const pattern of patterns) {
      match = analysisText.match(pattern);
      if (match) break;
    }
    
    if (match) {
      // @ts-ignore - 동적 속성 할당
      analysis[key] = parseFloat(match[1]);
      
      // 설명이 있는 경우 설명도 저장
      if (match[2]) {
        // @ts-ignore - 동적 속성 할당
        analysis[`${key}Desc`] = match[2].trim();
      }
    }
  }

  // 평균 점수 추출
  const avgScorePatterns = [
    /평균 점수:?\s*(\d+(?:\.\d+)?)점/i,
    /평균:?\s*(\d+(?:\.\d+)?)점/i
  ];

  let avgScoreMatch = null;
  for (const pattern of avgScorePatterns) {
    avgScoreMatch = analysisText.match(pattern);
    if (avgScoreMatch) break;
  }

  if (avgScoreMatch) {
    analysis.averageScore = parseFloat(avgScoreMatch[1]);
  } else {
    // 평균 점수가 없으면 개별 점수들의 평균 계산
    const scores = [
      analysis.goldenRatio,
      analysis.facialFeatures,
      analysis.skinTexture,
      analysis.impressiveness,
      analysis.growingCharm
    ].filter(score => score > 0);
    
    if (scores.length > 0) {
      analysis.averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
  }

  // 페르소나 추출
  const personaPatterns = [
    /\*\*페르소나:\*\*\s*([^\n]+)/i,
    /페르소나:?\s*([^\n]+)/i
  ];

  let personaMatch = null;
  for (const pattern of personaPatterns) {
    personaMatch = analysisText.match(pattern);
    if (personaMatch) break;
  }
  
  if (personaMatch) {
    analysis.persona = personaMatch[1].trim();
  }

  // 종합 평가 추출
  const descriptionPatterns = [
    /\*\*종합 평가\*\*\s*\n([^*]+)/i,
    /종합 평가\s*\n([^*]+)/i
  ];

  let descriptionMatch = null;
  for (const pattern of descriptionPatterns) {
    descriptionMatch = analysisText.match(pattern);
    if (descriptionMatch) break;
  }
  
  if (descriptionMatch) {
    analysis.description = descriptionMatch[1].trim();
  }

  return analysis;
}

/**
 * 다중 이미지 비교 결과를 파싱하는 함수 (3-4명용)
 */
export function parseMultipleComparisonResult(comparisonText: string, participantCount: number) {
  const participants: Array<{
    goldenRatio: number;
    goldenRatioDesc: string;
    facialFeatures: number;
    facialFeaturesDesc: string;
    skinTexture: number;
    skinTextureDesc: string;
    impressiveness: number;
    impressivenessDesc: string;
    growingCharm: number;
    growingCharmDesc: string;
    averageScore: number;
    persona: string;
    description: string;
    rank: number;
  }> = [];
  const labels = ['첫 번째', '두 번째', '세 번째', '네 번째'];
  
  // 각 참가자별로 분석 결과 파싱
  for (let i = 0; i < participantCount; i++) {
    const label = labels[i];
    const nextLabel = i < participantCount - 1 ? labels[i + 1] : '평균 점수';
    
    // 해당 참가자의 분석 섹션 추출 (정규식 특수문자 이스케이프)
    let sectionPattern = new RegExp(`\\*\\*${label} 이미지 분석\\*\\*([\\s\\S]*?)(?=\\*\\*${nextLabel}|\\*\\*평균 점수\\*\\*|평균 점수|$)`, 'i');
    let sectionMatch = comparisonText.match(sectionPattern);
    
    if (!sectionMatch) {
      // 다른 패턴 시도 (별표 없는 버전)
      sectionPattern = new RegExp(`${label} 이미지 분석([\\s\\S]*?)(?=${nextLabel}|평균 점수|최종 순위|$)`, 'i');
      sectionMatch = comparisonText.match(sectionPattern);
    }
    
    const sectionText = sectionMatch ? sectionMatch[1] : '';
    
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
      description: '',
      rank: 0 // 순위 정보 추가
    };

    // 점수 패턴들 (정규식 특수문자 이스케이프)
    const flexibleScorePatterns = {
      goldenRatio: [
        /황금비율 점수:?\s*(\d+(?:\.\d+)?)점?\s*\n([^\n]+)/i,
        /황금비율:?\s*(\d+(?:\.\d+)?)점?/i
      ],
      facialFeatures: [
        /이목구비 정밀도:?\s*(\d+(?:\.\d+)?)점?\s*\n([^\n]+)/i,
        /이목구비:?\s*(\d+(?:\.\d+)?)점?/i
      ],
      skinTexture: [
        /피부 텍스처:?\s*(\d+(?:\.\d+)?)점?\s*\n([^\n]+)/i,
        /피부:?\s*(\d+(?:\.\d+)?)점?/i
      ],
      impressiveness: [
        /분위기:?\s*(\d+(?:\.\d+)?)점?\s*\n([^\n]+)/i,
        /분위기:?\s*(\d+(?:\.\d+)?)점?/i
      ],
      growingCharm: [
        /볼매 지수:?\s*(\d+(?:\.\d+)?)점?\s*\n([^\n]+)/i,
        /볼매:?\s*(\d+(?:\.\d+)?)점?/i
      ]
    };

    // 각 항목별 점수와 설명 추출
    for (const [key, patterns] of Object.entries(flexibleScorePatterns)) {
      let match = null;
      for (const pattern of patterns) {
        match = sectionText.match(pattern);
        if (match) break;
      }
      
      if (match) {
        // @ts-ignore - 동적 속성 할당
        analysis[key] = parseFloat(match[1]);
        
        // 설명이 있는 경우 설명도 저장
        if (match[2]) {
          // @ts-ignore - 동적 속성 할당
          analysis[`${key}Desc`] = match[2].trim();
        }
      }
    }

    // 페르소나 추출 (정규식 특수문자 이스케이프)
    const personaPatterns = [
      /\*\*페르소나:\*\*\s*([^\n]+)/i,
      /페르소나:?\s*([^\n]+)/i
    ];
    
    let personaMatch = null;
    for (const pattern of personaPatterns) {
      personaMatch = sectionText.match(pattern);
      if (personaMatch) break;
    }
    
    if (personaMatch) {
      analysis.persona = personaMatch[1].trim();
    }

    participants.push(analysis);
  }

  // 평균 점수 추출 (정규식 특수문자 이스케이프)
  for (let i = 0; i < participantCount; i++) {
    const label = labels[i];
    const avgScorePatterns = [
      new RegExp(`\\*\\s*${label} 이미지:?\\s*(\\d+(?:\\.\\d+)?)점`, 'i'),
      new RegExp(`${label} 이미지:?\\s*(\\d+(?:\\.\\d+)?)점`, 'i'),
      new RegExp(`${label}:?\\s*(\\d+(?:\\.\\d+)?)점`, 'i')
    ];
    
    let avgScoreMatch = null;
    for (const pattern of avgScorePatterns) {
      avgScoreMatch = comparisonText.match(pattern);
      if (avgScoreMatch) break;
    }
    
    if (avgScoreMatch) {
      participants[i].averageScore = parseFloat(avgScoreMatch[1]);
    } else {
      // 평균 점수가 없으면 개별 점수들의 평균 계산
      const scores = [
        participants[i].goldenRatio,
        participants[i].facialFeatures,
        participants[i].skinTexture,
        participants[i].impressiveness,
        participants[i].growingCharm
      ].filter(score => score > 0);
      
      if (scores.length > 0) {
        participants[i].averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      }
    }
  }

  // 순위 추출 (정규식 특수문자 이스케이프)
  const rankingPatterns = [
    /\*\*최종 순위\*\*([^*]+)/i,
    /최종 순위([^*]*?)(?=\*\*|$)/i
  ];
  
  let rankingSection = null;
  for (const pattern of rankingPatterns) {
    rankingSection = comparisonText.match(pattern);
    if (rankingSection) break;
  }
  
  if (rankingSection) {
    const rankingText = rankingSection[1];
    
    for (let i = 0; i < participantCount; i++) {
      const label = labels[i];
      const rankPatterns = [
        new RegExp(`(\\d+)위:?\\s*${label}`, 'i'),
        new RegExp(`(\\d+)위.*?${label}`, 'i')
      ];
      
      let rankMatch = null;
      for (const pattern of rankPatterns) {
        rankMatch = rankingText.match(pattern);
        if (rankMatch) break;
      }
      
      if (rankMatch) {
        participants[i].rank = parseInt(rankMatch[1]);
      }
    }
  }

  // 순위가 설정되지 않았으면 평균 점수 기준으로 순위 매기기
  if (participants.every(p => p.rank === 0)) {
    const sortedParticipants = [...participants]
      .map((p, index) => ({ ...p, originalIndex: index }))
      .sort((a, b) => b.averageScore - a.averageScore);
    
    sortedParticipants.forEach((p, index) => {
      participants[p.originalIndex].rank = index + 1;
    });
  }

  // 종합 판정 추출 (정규식 특수문자 이스케이프)
  const verdictPatterns = [
    /🔮\s*마법의 거울 최종 판정\s*\n([^*]+)/i,
    /마법의 거울 최종 판정\s*\n([^*]+)/i,
    /\*\*🔮\s*마법의 거울 최종 판정\*\*\s*\n([^*]+)/i,
    /\*\*마법의 거울 최종 판정\*\*\s*\n([^*]+)/i,
    /\*\*종합 판정\*\*\s*\n([^*]+)/i,
    /종합 판정\s*\n([^*]+)/i,
    /\*\*🏆 종합 판정\*\*\s*\n([^*]+)/i,
    /🏆 종합 판정\s*\n([^*]+)/i,
    /\*\*최종 판정\*\*\s*\n([^*]+)/i,
    /최종 판정\s*\n([^*]+)/i
  ];

  let verdict = '';
  for (const pattern of verdictPatterns) {
    const verdictMatch = comparisonText.match(pattern);
    if (verdictMatch) {
      verdict = verdictMatch[1].trim();
      break;
    }
  }

  // 모든 참가자에게 종합 판정 추가
  participants.forEach(p => {
    p.description = verdict;
  });

  return {
    participants,
    verdict
  };
} 