// 사용자 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  photoURL?: string;
}

export interface Analysis {
  goldenRatio: number;
  facialFeatures: number;
  skinTexture: number;
  impressiveness: number;
  growingCharm: number;
  averageScore: number;
  description: string;
  goldenRatioDesc?: string;
  facialFeaturesDesc?: string; 
  skinTextureDesc?: string;
  impressivenessDesc?: string;
  growingCharmDesc?: string;
  persona?: string;
  rank?: number;
}

export interface Image {
  id: string;
  userID: string;
  userName: string;
  imageUrl: string;
  createdAt: Date;
  analysis: Analysis;
  battleCount: number;
  winCount: number;
  lossCount: number;
  gender: 'male' | 'female' | 'unknown';
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