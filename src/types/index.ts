// 사용자 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  photoURL?: string;
}

// 이미지 타입 정의
export interface Image {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  analysis: Analysis;
  createdAt: Date;
  battlesCount: number;
  winsCount: number;
}

// 분석 결과 타입 정의
export interface Analysis {
  goldenRatio: number; // 황금비율 점수
  facialFeatures: number; // 이목구비 정밀도
  skinTexture: number; // 피부 텍스처
  impressiveness: number; // 분위기
  growingCharm: number; // 볼매 지수
  averageScore: number;
  description: string;
  persona?: string; // 이미지 페르소나 정의
  rank?: number; // 실시간 순위(선택적)
}

// 배틀 타입 정의
export interface Battle {
  id: string;
  image1Id: string;
  image2Id: string;
  winnerId: string;
  resultText: string;
  createdAt: Date;
}

// 배틀 결과 타입 정의
export interface BattleResult {
  battle: Battle;
  image1: Image;
  image2: Image;
  winner: Image;
} 