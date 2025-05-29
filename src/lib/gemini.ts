// Gemini API 설정 및 유틸리티 함수
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Gemini 모델 설정 (gemini-2.0-flash 모델 사용)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * 이미지를 base64 인코딩으로 변환하는 함수
 */
export async function fileToGenerativePart(file: File): Promise<{
  inlineData: { data: string; mimeType: string };
}> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result에서 base64 데이터 부분만 추출
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1]; // 'data:image/jpeg;base64,' 부분 제거
      resolve(base64Data);
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

/**
 * 이미지 분석 및 평가 수행하는 함수
 */
export async function analyzeImage(imageFile: File): Promise<string> {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    const prompt = `
      외모 평가를 수행하여 객관적인 분석 결과와 점수를 제공하세요.
      
      제공된 이미지에서 사람의 외모를 다음 기준으로 철저하게 분석하세요:
      
      1. 황금비율 점수(1-10점): 얼굴의 비율이 얼마나 완벽한지, 미의 기준에 얼마나 근접하는지 평가
      2. 이목구비 정밀도(1-10점): 눈, 코, 입의 형태와 배치가 얼마나 완벽한지 평가
      3. 피부 텍스처(1-10점): 피부 결, 모공 크기, 피부톤, 잡티 여부 등을 평가
      4. 분위기(1-10점): 첫인상에서 느껴지는 압도적인 아우라와 매력
      5. 볼매 지수(1-10점): 볼수록 매력적인 정도, 호감도 상승 가능성
      
      각 항목별로 1-10점 사이의 점수를 주고, 평균 점수도 계산하세요.
      각 항목마다 반드시 짧고 간결한 평가 코멘트를 1-2문장으로 추가하세요. 이 설명은 나중에 앱에서 표시되므로 매우 중요합니다.
      설명은 디시 인사이드 스타일로 유쾌하고 재미있게 작성하세요. 유머러스하고 과장된 표현을 사용하되, 너무 길지 않게 작성하세요.
      불필요한 설명이나 긴 대화체는 사용하지 않고 요점만 명확하게 전달하세요.
      
      **중요한 규칙:**
      * 절대로 실제 인물이나 유명인의 이름을 추정하거나 언급하지 마세요.
      * "○○○를 닮았다", "○○○처럼 생겼다" 같은 비교는 하지 마세요.
      * 사진 속 인물의 이름을 추측하거나 언급하는 것은 금지됩니다.
      * 유명인이나 연예인과 비교하는 내용도 금지됩니다.
      
      **추가 요청:** 
      이미지에 있는 사람의 매우 유쾌한 페르소나 정의를 디시 인사이드 커뮤니티 말투로 작성해주세요.
      주접스럽고 악질적인 톤으로, 1문장 내로 작성해 주세요.
      예: "청순 가련 여신", "싫어할 수 없는 관상" 등의 컨셉으로 정의해 주세요.
      페르소나 정의는 "**페르소나:**" 제목 아래에 작성해 주세요.
      
      결과는 반드시 아래 형식으로 출력하세요:

      **이미지 분석 결과**
      
      황금비율 점수: [1-10]점
      [이 점수를 준 이유에 대한 디시인사이드 스타일의 재미있고 과장된 설명 1-2문장]
      
      이목구비 정밀도: [1-10]점
      [이 점수를 준 이유에 대한 디시인사이드 스타일의 재미있고 과장된 설명 1-2문장]
      
      피부 텍스처: [1-10]점
      [이 점수를 준 이유에 대한 디시인사이드 스타일의 재미있고 과장된 설명 1-2문장]
      
      분위기: [1-10]점
      [이 점수를 준 이유에 대한 디시인사이드 스타일의 재미있고 과장된 설명 1-2문장]
      
      볼매 지수: [1-10]점
      [이 점수를 준 이유에 대한 디시인사이드 스타일의 재미있고 과장된 설명 1-2문장]
      
      평균 점수: [평균]점
      
      **페르소나:**
      [페르소나 정의 - 유명인 이름 언급 없이]
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('이미지 분석 중 오류 발생:', error);
    return '이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.';
  }
}

/**
 * 두 이미지를 비교 평가하는 함수
 */
export async function compareImages(imageFile1: File, imageFile2: File): Promise<string> {
  try {
    const imagePart1 = await fileToGenerativePart(imageFile1);
    const imagePart2 = await fileToGenerativePart(imageFile2);
    
    const prompt = `
      두 이미지를 객관적으로 비교하여 외모 점수와 평가를 제공하세요.
      
      두 이미지를 다음 5가지 기준으로 철저히 비교 분석하되, 출력은 아래 지정된 형식으로만 해주세요:
      
      1. 황금비율 점수(1-10점): 얼굴의 비율이 얼마나 완벽한지, 미의 기준에 얼마나 근접하는지 평가
      2. 이목구비 정밀도(1-10점): 눈, 코, 입의 형태와 배치가 얼마나 완벽한지 평가
      3. 피부 텍스처(1-10점): 피부 결, 모공 크기, 피부톤, 잡티 여부 등을 평가
      4. 분위기(1-10점): 첫인상에서 느껴지는 압도적인 아우라와 매력
      5. 볼매 지수(1-10점): 볼수록 매력적인 정도, 호감도 상승 가능성
      
      각 항목별로 두 이미지 각각 1-10점 사이의 점수를 매기고, 평균 점수도 계산하세요.
      각 항목마다 이유를 설명하는 짧은 코멘트를 반드시 추가하세요. 이 설명은 디시 인사이드 스타일로 유쾌하고 재미있게 작성하세요. 
      유머러스하고 과장된 표현을 사용하되, 실제 인물 비교는 하지 마세요.
      
      **중요한 규칙:**
      * 절대로 실제 인물이나 유명인의 이름을 추정하거나 언급하지 마세요.
      * "○○○를 닮았다", "○○○처럼 생겼다" 같은 비교는 하지 마세요.
      * 사진 속 인물의 이름을 추측하거나 언급하는 것은 금지됩니다.
      * 유명인이나 연예인과 비교하는 내용도 금지됩니다.
      * 평균 점수가 높은 이미지에 훨씬 더 좋은 평가를 해주세요.
      * 최종 판정은 반드시 평균 점수가 높은 이미지가 더 좋다는 내용으로 작성하세요. 절대 반대로 하지 마세요.
      
      **출력 형식**:
      반드시 아래 형식만 사용해 응답해주세요. 다른 분석은 출력하지 말아주세요.
      
      **첫 번째 이미지 분석**
      
      황금비율 점수: [1-10]점
      [이 점수를 준 이유에 대한 재미있고 과장된 설명. 디시인사이드 스타일로 작성]
      
      이목구비 정밀도: [1-10]점
      [이 점수를 준 이유에 대한 재미있고 과장된 설명. 디시인사이드 스타일로 작성]
      
      피부 텍스처: [1-10]점
      [이 점수를 준 이유에 대한 재미있고 과장된 설명. 디시인사이드 스타일로 작성]
      
      분위기: [1-10]점
      [이 점수를 준 이유에 대한 재미있고 과장된 설명. 디시인사이드 스타일로 작성]
      
      볼매 지수: [1-10]점
      [이 점수를 준 이유에 대한 재미있고 과장된 설명. 디시인사이드 스타일로 작성]
      
      **두 번째 이미지 분석**
      
      황금비율 점수: [1-10]점
      [이 점수를 준 이유에 대한 재미있고 과장된 설명. 디시인사이드 스타일로 작성]
      
      이목구비 정밀도: [1-10]점
      [이 점수를 준 이유에 대한 재미있고 과장된 설명. 디시인사이드 스타일로 작성]
      
      피부 텍스처: [1-10]점
      [이 점수를 준 이유에 대한 재미있고 과장된 설명. 디시인사이드 스타일로 작성]
      
      분위기: [1-10]점
      [이 점수를 준 이유에 대한 재미있고 과장된 설명. 디시인사이드 스타일로 작성]
      
      볼매 지수: [1-10]점
      [이 점수를 준 이유에 대한 재미있고 과장된 설명. 디시인사이드 스타일로 작성]
      
      **페르소나**
      * 첫 번째 이미지: [매우 과장되고 주접스러운 페르소나 정의 - 유명인 이름 언급 없이]
      * 두 번째 이미지: [매우 과장되고 주접스러운 페르소나 정의 - 유명인 이름 언급 없이]
      
      **평균 점수**
      * 첫 번째 이미지: [평균점수]점
      * 두 번째 이미지: [평균점수]점
      
      **최종 승자: [평균 점수가 더 높은 이미지를 여기에 명시하세요]**
      
      **최종 판정**
      [승자가 이긴 이유를 디시 인사이드 커뮤니티 말투로 주접스럽고 자극적이게 자유롭게 설명. 이 때 반드시 평균 점수가 높은 이미지를 칭찬하고 점수가 낮은 이미지를 약간 깎아내리는 방식으로 서술. 실제 인물이나 유명인의 이름은 절대 언급하지 말 것. 승자의 장점들을 구체적으로 언급하며 왜 승자가 더 높은 점수를 받았는지 명확하게 설명할 것]
    `;

    const result = await model.generateContent([prompt, imagePart1, imagePart2]);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('이미지 비교 중 오류 발생:', error);
    return '이미지 비교 중 오류가 발생했습니다. 다시 시도해주세요.';
  }
}

/**
 * 단일 이미지 심화 분석 (1명용 시뮬레이션)
 */
export async function analyzeImageSolo(imageFile: File): Promise<string> {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    const prompt = `
      이 이미지에 있는 사람의 외모를 매우 상세하고 깊이 있게 분석해주세요.
      1명만의 완전한 프로필을 작성하는 것처럼 철저하게 분석하세요.
      
      다음 기준으로 분석하고 각 항목에 1-10점을 매기세요:
      
      1. 황금비율 점수(1-10점): 얼굴의 비율이 얼마나 완벽한지, 미의 기준에 얼마나 근접하는지
      2. 이목구비 정밀도(1-10점): 눈, 코, 입의 형태와 배치가 얼마나 완벽한지
      3. 피부 텍스처(1-10점): 피부 결, 모공 크기, 피부톤, 잡티 여부 등
      4. 분위기(1-10점): 첫인상에서 느껴지는 압도적인 아우라와 매력
      5. 볼매 지수(1-10점): 볼수록 매력적인 정도, 호감도 상승 가능성
      
      **중요한 규칙:**
      * 절대로 실제 인물이나 유명인의 이름을 추정하거나 언급하지 마세요.
      * 유명인과 비교하는 내용도 금지됩니다.
      * 디시인사이드 스타일로 유쾌하고 재미있게 작성하세요.
      
      **출력 형식**:
      
      **솔로 분석 결과**
      
      황금비율 점수: [1-10]점
      [이 점수를 준 이유에 대한 디시인사이드 스타일의 재미있고 과장된 설명]
      
      이목구비 정밀도: [1-10]점
      [이 점수를 준 이유에 대한 디시인사이드 스타일의 재미있고 과장된 설명]
      
      피부 텍스처: [1-10]점
      [이 점수를 준 이유에 대한 디시인사이드 스타일의 재미있고 과장된 설명]
      
      분위기: [1-10]점
      [이 점수를 준 이유에 대한 디시인사이드 스타일의 재미있고 과장된 설명]
      
      볼매 지수: [1-10]점
      [이 점수를 준 이유에 대한 디시인사이드 스타일의 재미있고 과장된 설명]
      
      **페르소나:** [매우 과장되고 주접스러운 페르소나 정의 - 유명인 이름 언급 없이]
      
      **평균 점수:** [평균점수]점
      
      **종합 평가**
      [이 사람의 전체적인 매력과 특징을 디시인사이드 커뮤니티 말투로 재미있고 주접스럽게 평가. 장점들을 구체적으로 언급하며 왜 이런 점수를 받았는지 설명]
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('솔로 이미지 분석 중 오류 발생:', error);
    return '솔로 이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.';
  }
}

/**
 * 다중 이미지 비교 분석 (3-4명용 시뮬레이션)
 */
export async function compareMultipleImages(imageFiles: File[]): Promise<string> {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const imageParts = await Promise.all(
        imageFiles.map(file => fileToGenerativePart(file))
      );
      
      const participantCount = imageFiles.length;
      const participantLabels = ['첫 번째', '두 번째', '세 번째', '네 번째'].slice(0, participantCount);
      
      // 인원수별 맞춤 프롬프트 생성
      let competitionType = '';
      let competitionDescription = '';
      let rankingDescription = '';
      
      if (participantCount === 3) {
        competitionType = '트리플 매치';
        competitionDescription = '3명이 참가한 치열한 삼파전 대결입니다. 각자의 개성과 매력을 최대한 발휘해서 누가 가장 뛰어난지 겨루는 토너먼트입니다.';
        rankingDescription = '1위는 압도적인 승자, 2위는 아쉬운 준우승자, 3위는 다음 기회를 노리는 도전자입니다.';
      } else if (participantCount === 4) {
        competitionType = '쿼드러플 배틀';
        competitionDescription = '4명이 참가한 대규모 토너먼트 배틀입니다. 각자의 독특한 매력과 개성으로 치열한 4파전을 벌이는 최고 수준의 경쟁입니다.';
        rankingDescription = '1위는 절대 챔피언, 2위는 강력한 준우승자, 3위는 선전한 세미파이널리스트, 4위는 용감한 도전자입니다.';
      } else {
        competitionType = `${participantCount}명 매치`;
        competitionDescription = `${participantCount}명이 참가한 특별한 대결입니다.`;
        rankingDescription = '각 순위별로 의미있는 평가를 해주세요.';
      }
      
      const prompt = `
        **🏆 ${competitionType} - ${participantCount}명 AI 분석 & 순위 매기기 🏆**
        
        ${competitionDescription}
        
        ${participantCount}개의 이미지를 객관적이고 공정하게 비교하여 명확한 순위를 매기고 각각의 외모 점수와 평가를 제공하세요.
        
        **📊 분석 기준 (각 항목 1-10점):**
        
        1. **황금비율 점수**: 얼굴의 비율이 얼마나 완벽한지, 미의 황금 기준 근접도
        2. **이목구비 정밀도**: 눈, 코, 입의 형태와 배치의 완벽도, 조화로움
        3. **피부 텍스처**: 피부 결, 모공 크기, 피부톤의 균일함, 잡티 여부
        4. **분위기**: 첫인상에서 느껴지는 압도적인 아우라와 카리스마
        5. **볼매 지수**: 볼수록 매력적인 정도, 지속적인 호감도 상승 가능성
        
        **⚠️ 중요한 규칙:**
        * 절대로 실제 인물이나 유명인의 이름을 추정하거나 언급하지 마세요.
        * 유명인과 비교하는 내용도 금지됩니다.
        * 디시인사이드 스타일로 유쾌하고 재미있게 작성하세요.
        * 평균 점수 기준으로 정확하고 공정한 순위를 매기세요.
        * ${rankingDescription}
        
        **📝 출력 형식 (반드시 준수):**
        
        ${participantLabels.map((label, index) => `
        **${label} 이미지 분석**
        
        황금비율 점수: [1-10]점
        [점수 이유 설명 - 디시인사이드 스타일로 재미있고 구체적으로]
        
        이목구비 정밀도: [1-10]점
        [점수 이유 설명 - 디시인사이드 스타일로 재미있고 구체적으로]
        
        피부 텍스처: [1-10]점
        [점수 이유 설명 - 디시인사이드 스타일로 재미있고 구체적으로]
        
        분위기: [1-10]점
        [점수 이유 설명 - 디시인사이드 스타일로 재미있고 구체적으로]
        
        볼매 지수: [1-10]점
        [점수 이유 설명 - 디시인사이드 스타일로 재미있고 구체적으로]
        
        **페르소나:** [과장되고 주접스러운 페르소나 정의 - 디시 특유의 재미있는 표현]`).join('')}
        
        **평균 점수**
        ${participantLabels.map(label => `* ${label} 이미지: [정확한 평균점수]점`).join('\n')}
        
        **최종 순위** 
        (⚠️ 반드시 평균 점수가 높은 순서대로 정확하게 배치)
        1위: [가장 높은 평균 점수의 이미지] 
        2위: [두 번째로 높은 평균 점수의 이미지]
        ${participantCount >= 3 ? '3위: [세 번째로 높은 평균 점수의 이미지]' : ''}
        ${participantCount >= 4 ? '4위: [네 번째로 높은 평균 점수의 이미지]' : ''}
        
        **🔮 마법의 거울 최종 판정**
        [${competitionType} 결과에 대해 디시인사이드 커뮤니티 말투로 자극적이고 주접스럽게 설명. 
        "야, 솔직히 1위가 압살이지. ㅋㅋㅋ" 같은 식으로 시작해서, 
        1위가 왜 1위인지 구체적인 장점들을 언급하고, 
        다른 순위들은 왜 밀렸는지 비교하며 설명해주세요.
        실제 인물 이름은 절대 언급하지 말고, 순위 결과를 흥미진진하고 자극적으로 분석해주세요.
        "ㅇㄱㄹㅇ ㅂㅂㅂㄱ 닥승!" 같은 디시 특유의 표현도 사용해주세요.
        특히 ${participantCount}명이 모두 참가한 ${competitionType}에서 각자의 매력 포인트를 비교하며 왜 이런 순위가 나왔는지 명확하게 설명해주세요.]
      `;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error: any) {
      console.error(`다중 이미지 비교 중 오류 발생 (시도 ${attempt}/${maxRetries}):`, error);
      lastError = error;
      
      // 503 에러(서버 과부하)인 경우
      if (error.message && error.message.includes('503')) {
        if (attempt < maxRetries) {
          console.log(`서버 과부하로 인한 재시도 (${attempt + 1}/${maxRetries})...`);
          // 지수 백오프: 1초, 2초, 4초 대기
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        } else {
          return `
**🚫 일시적 서버 과부하**

죄송합니다. 현재 AI 서버가 과부하 상태입니다.
잠시 후 다시 시도해주세요.

**임시 분석 결과:**
모든 참가자가 각자의 독특한 매력을 보여주는 훌륭한 시뮬레이션이었습니다!

**평균 점수**
${imageFiles.map((_, i) => `* ${['첫 번째', '두 번째', '세 번째', '네 번째'][i]} 이미지: 7.5점`).join('\n')}

**최종 순위**
${imageFiles.map((_, i) => `${i + 1}위: ${['첫 번째', '두 번째', '세 번째', '네 번째'][i]} 이미지`).join('\n')}

**종합 판정**
현재 서버 과부하로 인해 상세 분석을 완료하지 못했습니다. 
모든 참가자가 뛰어난 매력을 보여주었으며, 잠시 후 다시 시도하시면 더 정확한 분석 결과를 확인하실 수 있습니다.
          `;
        }
      }
      
      // 다른 에러인 경우에도 마지막 시도가 아니면 재시도
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
    }
  }
  
  // 모든 재시도가 실패한 경우
  return `다중 이미지 비교 중 오류가 발생했습니다. 다시 시도해주세요. (에러: ${lastError?.message || '알 수 없는 오류'})`;
}

export { model }; 