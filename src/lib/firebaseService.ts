import { 
  collection, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  doc, 
  query, 
  orderBy, 
  limit as firestoreLimit, 
  where, 
  serverTimestamp, 
  Timestamp,
  increment as firestoreIncrement
} from 'firebase/firestore';
import { ref as dbRef, set, push, get, child, update } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { db, rtdb } from './firebase';
import type { User, Image, Battle, Analysis } from '../types';

// 파일을 base64로 인코딩하고 크기를 조절하는 함수
export async function fileToBase64(file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new globalThis.Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      
      img.onload = () => {
        // 이미지 크기 계산
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        // Canvas에 이미지 그리기
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('캔버스 컨텍스트를 생성할 수 없습니다.'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // 압축된 base64 데이터 반환
        const base64String = canvas.toDataURL(file.type, quality);
        resolve(base64String);
      };
      
      img.onerror = () => {
        reject(new Error('이미지를 로드할 수 없습니다.'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('파일을 읽을 수 없습니다.'));
    };
    
    reader.readAsDataURL(file);
  });
}

// 이미지 업로드 및 저장
export async function uploadImage(
  file: File, 
  user: User, 
  analysis: Analysis,
  gender: 'male' | 'female'
): Promise<Image> {
  try {
    // 이미지를 base64로 인코딩
    const imageId = uuidv4();
    const base64Image = await fileToBase64(file);

    // Realtime Database에 이미지 정보 저장
    const imageData: Omit<Image, 'id'> = {
      userID: user.id,
      userName: user.name,
      imageUrl: base64Image, // base64 인코딩된 이미지 저장
      analysis,
      createdAt: new Date(),
      battleCount: 0,
      winCount: 0,
      lossCount: 0,
      gender
    };

    // Realtime Database에 이미지 저장
    const newImageRef = dbRef(rtdb, `images/${imageId}`);
    await set(newImageRef, {
      ...imageData,
      createdAt: new Date().toISOString()
    });

    return {
      id: imageId,
      ...imageData
    };
  } catch (error) {
    console.error('이미지 업로드 중 오류:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
}

// 이미지 목록 가져오기
export async function getImages(limitCount: number = 10): Promise<Image[]> {
  try {
    // Realtime Database에서 이미지 가져오기
    const imagesRef = dbRef(rtdb, 'images');
    const snapshot = await get(imagesRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const images: Image[] = [];
    const data = snapshot.val();
    
    // 최대 limitCount만큼의 이미지 가져오기 (최신순)
    Object.keys(data).forEach(key => {
      if (images.length < limitCount) {
        const imageData = data[key];
        images.push({
          id: key,
          userID: imageData.userID || imageData.userId,
          userName: imageData.userName,
          imageUrl: imageData.imageUrl,
          analysis: imageData.analysis,
          createdAt: new Date(imageData.createdAt),
          battleCount: imageData.battleCount || imageData.battlesCount || 0,
          winCount: imageData.winCount || imageData.winsCount || 0,
          lossCount: imageData.lossCount || 0,
          gender: imageData.gender || 'unknown'
        });
      }
    });
    
    // 날짜 기준 내림차순 정렬
    return images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('이미지 가져오기 중 오류:', error);
    throw new Error('이미지 목록을 가져오는데 실패했습니다.');
  }
}

// 랜덤 이미지 가져오기 (대결용)
export async function getRandomImageForBattle(currentImageId: string, currentImageGender?: 'male' | 'female' | 'unknown'): Promise<Image | null> {
  try {
    // Realtime Database에서 이미지 가져오기
    const imagesRef = dbRef(rtdb, 'images');
    const snapshot = await get(imagesRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    // 현재 이미지를 제외한 이미지들만 필터링
    const availableImages: Image[] = [];
    const data = snapshot.val();
    
    Object.keys(data).forEach(key => {
      if (key !== currentImageId) {
        const imageData = data[key];
        const imageGender = imageData.gender || 'unknown';
        
        // 성별이 지정된 경우 같은 성별끼리만 매칭
        if (currentImageGender && currentImageGender !== 'unknown' && imageGender !== currentImageGender) {
          return; // 다른 성별이면 제외
        }
        
        availableImages.push({
          id: key,
          userID: imageData.userID || imageData.userId,
          userName: imageData.userName,
          imageUrl: imageData.imageUrl,
          analysis: imageData.analysis,
          createdAt: new Date(imageData.createdAt),
          battleCount: imageData.battleCount || imageData.battlesCount || 0,
          winCount: imageData.winCount || imageData.winsCount || 0,
          lossCount: imageData.lossCount || 0,
          gender: imageGender
        });
      }
    });
    
    // 이미지가 없으면 null 반환
    if (availableImages.length === 0) {
      return null;
    }
    
    // 랜덤 이미지 선택
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    return availableImages[randomIndex];
  } catch (error) {
    console.error('랜덤 이미지 가져오기 중 오류:', error);
    throw new Error('대결할 이미지를 가져오는데 실패했습니다.');
  }
}

// 배틀 결과 저장 (공유 가능한 ID와 함께) - 수정된 버전
export async function saveBattleResult(
  image1Id: string,
  image2Id: string,
  winnerId: string,
  resultText: string,
  image1Data?: Image,
  image2Data?: Image
): Promise<Battle> {
  try {
    const battleId = uuidv4();
    
    // 배틀 정보 저장 (이미지 데이터도 함께 저장하여 공유 시 사용)
    const battleData = {
      image1Id,
      image2Id,
      winnerId,
      resultText,
      createdAt: new Date().toISOString(),
      // 공유를 위한 이미지 데이터 저장
      image1Data: image1Data ? {
        id: image1Data.id,
        userName: image1Data.userName,
        imageUrl: image1Data.imageUrl,
        analysis: image1Data.analysis,
        gender: image1Data.gender
      } : null,
      image2Data: image2Data ? {
        id: image2Data.id,
        userName: image2Data.userName,
        imageUrl: image2Data.imageUrl,
        analysis: image2Data.analysis,
        gender: image2Data.gender
      } : null
    };
    
    // Realtime Database에 배틀 결과 저장
    const battleRef = dbRef(rtdb, `battles/${battleId}`);
    await set(battleRef, battleData);
    
    // 통계 업데이트 - 필드명 통일 및 올바른 로직
    console.log('배틀 통계 업데이트 시작...');
    
    // 두 참가자 모두 배틀 수 증가
    const updatePromises = [];
    
    // Image1 배틀 수 증가
    const image1Ref = dbRef(rtdb, `images/${image1Id}`);
    updatePromises.push(
      get(image1Ref).then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const currentBattleCount = data.battleCount || 0;
          const currentWinCount = data.winCount || 0;
          
          return update(image1Ref, {
            battleCount: currentBattleCount + 1,
            winCount: winnerId === image1Id ? currentWinCount + 1 : currentWinCount
          });
        }
      })
    );
    
    // Image2 배틀 수 증가
    const image2Ref = dbRef(rtdb, `images/${image2Id}`);
    updatePromises.push(
      get(image2Ref).then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const currentBattleCount = data.battleCount || 0;
          const currentWinCount = data.winCount || 0;
          
          return update(image2Ref, {
            battleCount: currentBattleCount + 1,
            winCount: winnerId === image2Id ? currentWinCount + 1 : currentWinCount
          });
        }
      })
    );
    
    // 모든 업데이트 완료 대기
    await Promise.all(updatePromises);
    
    console.log('배틀 통계 업데이트 완료');
    
    return {
      id: battleId,
      image1Id,
      image2Id,
      winnerId,
      resultText,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('배틀 결과 저장 중 오류:', error);
    throw new Error('배틀 결과를 저장하는데 실패했습니다.');
  }
}

// 배틀 결과 조회 (공유용)
export async function getBattleResult(battleId: string): Promise<{
  battle: Battle;
  image1: Image;
  image2: Image;
  winner: Image;
} | null> {
  try {
    // Realtime Database에서 배틀 결과 가져오기
    const battleRef = dbRef(rtdb, `battles/${battleId}`);
    const snapshot = await get(battleRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const battleData = snapshot.val();
    
    // 저장된 이미지 데이터가 있으면 사용, 없으면 개별 조회
    let image1: Image, image2: Image;
    
    if (battleData.image1Data && battleData.image2Data) {
      // 저장된 데이터 사용
      image1 = {
        ...battleData.image1Data,
        createdAt: new Date(),
        battleCount: 0,
        winCount: 0,
        lossCount: 0
      };
      image2 = {
        ...battleData.image2Data,
        createdAt: new Date(),
        battleCount: 0,
        winCount: 0,
        lossCount: 0
      };
    } else {
      // 개별 이미지 조회
      const image1Ref = dbRef(rtdb, `images/${battleData.image1Id}`);
      const image1Snapshot = await get(image1Ref);
      
      const image2Ref = dbRef(rtdb, `images/${battleData.image2Id}`);
      const image2Snapshot = await get(image2Ref);
      
      if (!image1Snapshot.exists() || !image2Snapshot.exists()) {
        return null;
      }
      
      const image1Data = image1Snapshot.val();
      const image2Data = image2Snapshot.val();
      
      image1 = {
        id: battleData.image1Id,
        userID: image1Data.userID || image1Data.userId,
        userName: image1Data.userName,
        imageUrl: image1Data.imageUrl,
        analysis: image1Data.analysis,
        createdAt: new Date(image1Data.createdAt),
        battleCount: image1Data.battleCount || image1Data.battlesCount || 0,
        winCount: image1Data.winCount || image1Data.winsCount || 0,
        lossCount: image1Data.lossCount || 0,
        gender: image1Data.gender || 'unknown'
      };
      
      image2 = {
        id: battleData.image2Id,
        userID: image2Data.userID || image2Data.userId,
        userName: image2Data.userName,
        imageUrl: image2Data.imageUrl,
        analysis: image2Data.analysis,
        createdAt: new Date(image2Data.createdAt),
        battleCount: image2Data.battleCount || image2Data.battlesCount || 0,
        winCount: image2Data.winCount || image2Data.winsCount || 0,
        lossCount: image2Data.lossCount || 0,
        gender: image2Data.gender || 'unknown'
      };
    }
    
    const winner = battleData.winnerId === image1.id ? image1 : image2;
    
    const battle: Battle = {
      id: battleId,
      image1Id: battleData.image1Id,
      image2Id: battleData.image2Id,
      winnerId: battleData.winnerId,
      resultText: battleData.resultText,
      createdAt: new Date(battleData.createdAt)
    };
    
    return {
      battle,
      image1,
      image2,
      winner
    };
  } catch (error) {
    console.error('배틀 결과 조회 중 오류:', error);
    throw new Error('배틀 결과를 조회하는데 실패했습니다.');
  }
}

// 베이지안 평균을 계산하는 함수
function calculateBayesianAverage(wins: number, battles: number, globalAverage: number = 0.5, confidence: number = 10): number {
  // 베이지안 평균 공식: (C × m + R × v) / (C + v)
  // C: 신뢰도 상수, m: 전체 평균 승률, R: 실제 승수, v: 실제 배틀 수
  return (confidence * globalAverage + wins) / (confidence + battles);
}

// Wilson Score를 계산하는 함수 (더 정확한 방법)
function calculateWilsonScore(wins: number, battles: number, confidence: number = 1.96): number {
  if (battles === 0) return 0;
  
  const p = wins / battles; // 승률
  const n = battles; // 총 배틀 수
  const z = confidence; // 95% 신뢰구간의 z값
  
  // Wilson Score 공식
  const numerator = p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
  const denominator = 1 + (z * z) / n;
  
  return numerator / denominator;
}

// 상위 랭킹 이미지 가져오기 (개선된 랭킹 시스템)
export async function getTopRankedImages(limitCount: number = 10, gender?: 'male' | 'female' | 'unknown'): Promise<Image[]> {
  try {
    console.log('개선된 랭킹 시스템으로 데이터 조회 시작...');
    const startTime = Date.now();
    
    // Realtime Database에서 이미지 가져오기
    const imagesRef = dbRef(rtdb, 'images');
    const snapshot = await get(imagesRef);
    
    if (!snapshot.exists()) {
      console.log('데이터가 존재하지 않음');
      return [];
    }

    const images: Image[] = [];
    const data = snapshot.val();
    
    console.log('Firebase에서 가져온 전체 데이터 키 개수:', Object.keys(data).length);
    console.log('요청된 성별 필터:', gender);
    
    // 최소 배틀 수 설정
    const MIN_BATTLES = 3; // 최소 3전 이상
    
    // 전체 평균 승률 계산 (베이지안 평균용)
    let totalWins = 0;
    let totalBattles = 0;
    
    Object.keys(data).forEach(key => {
      const imageData = data[key];
      const battleCount = imageData.battleCount || 0;
      const winCount = imageData.winCount || 0;
      
      if (battleCount >= MIN_BATTLES) {
        totalWins += winCount;
        totalBattles += battleCount;
      }
    });
    
    const globalWinRate = totalBattles > 0 ? totalWins / totalBattles : 0.5;
    console.log(`전체 평균 승률: ${(globalWinRate * 100).toFixed(1)}%`);
    
    // 데이터 처리 및 랭킹 점수 계산
    const validImages: Array<{
      key: string, 
      data: any, 
      winRate: number, 
      bayesianScore: number,
      wilsonScore: number,
      battleCount: number,
      winCount: number
    }> = [];
    
    Object.keys(data).forEach(key => {
      const imageData = data[key];
      const imageGender = imageData.gender || 'unknown';
      const battleCount = imageData.battleCount || 0;
      const winCount = imageData.winCount || 0;
      
      // 데이터 검증
      if (winCount > battleCount) {
        console.warn(`데이터 오류 발견 - ${imageData.userName}: 승수(${winCount}) > 배틀수(${battleCount})`);
        return;
      }
      
      // 최소 배틀 수 조건
      if (battleCount >= MIN_BATTLES) {
        // 성별 필터가 지정된 경우 해당 성별만 포함
        if (gender && imageGender !== gender) {
          return;
        }
        
        const winRate = battleCount > 0 ? (winCount / battleCount) : 0;
        const bayesianScore = calculateBayesianAverage(winCount, battleCount, globalWinRate);
        const wilsonScore = calculateWilsonScore(winCount, battleCount);
        
        validImages.push({
          key,
          data: imageData,
          winRate,
          bayesianScore,
          wilsonScore,
          battleCount,
          winCount
        });
      }
    });
    
    console.log('필터링된 이미지 개수:', validImages.length);
    console.log(`최소 배틀 수 조건: ${MIN_BATTLES}전 이상`);
    
    // Wilson Score 기준으로 정렬 (가장 정확한 방법)
    validImages.sort((a, b) => {
      // 1차: Wilson Score
      if (Math.abs(b.wilsonScore - a.wilsonScore) > 0.001) {
        return b.wilsonScore - a.wilsonScore;
      }
      // 2차: 배틀 수 (동점일 경우 더 많은 배틀을 한 사람이 우선)
      return b.battleCount - a.battleCount;
    });
    
    // 상위 limitCount 개만 선택하여 Image 객체 생성
    const topImages = validImages.slice(0, limitCount);
    
    topImages.forEach(({key, data: imageData, winRate, bayesianScore, wilsonScore, battleCount, winCount}, index) => {
      console.log(`${index + 1}위: ${imageData.userName} - 승률: ${(winRate * 100).toFixed(1)}%, Wilson: ${(wilsonScore * 100).toFixed(1)}%, 배틀: ${battleCount}전 ${winCount}승`);
      
      images.push({
        id: key,
        userID: imageData.userID || imageData.userId,
        userName: imageData.userName,
        imageUrl: imageData.imageUrl,
        analysis: imageData.analysis,
        createdAt: new Date(imageData.createdAt),
        battleCount: battleCount,
        winCount: winCount,
        lossCount: battleCount - winCount,
        gender: imageData.gender || 'unknown'
      });
    });
    
    const endTime = Date.now();
    console.log(`개선된 랭킹 시스템 조회 완료: ${endTime - startTime}ms`);
    console.log('최종 반환 이미지 개수:', images.length);
    
    return images;
  } catch (error) {
    console.error('랭킹 이미지 가져오기 중 오류:', error);
    throw new Error('랭킹 이미지를 가져오는데 실패했습니다.');
  }
}

// 나의 이미지 목록 가져오기
export async function getUserImages(userId: string): Promise<Image[]> {
  try {
    // Realtime Database에서 이미지 가져오기
    const imagesRef = dbRef(rtdb, 'images');
    const snapshot = await get(imagesRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const images: Image[] = [];
    const data = snapshot.val();
    
    // 특정 사용자의 이미지만 필터링
    Object.keys(data).forEach(key => {
      const imageData = data[key];
      if ((imageData.userID || imageData.userId) === userId) {
        images.push({
          id: key,
          userID: imageData.userID || imageData.userId,
          userName: imageData.userName,
          imageUrl: imageData.imageUrl,
          analysis: imageData.analysis,
          createdAt: new Date(imageData.createdAt),
          battleCount: imageData.battleCount || imageData.battlesCount || 0,
          winCount: imageData.winCount || imageData.winsCount || 0,
          lossCount: imageData.lossCount || 0,
          gender: imageData.gender || 'unknown'
        });
      }
    });
    
    // 날짜 기준 내림차순 정렬
    return images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('사용자 이미지 가져오기 중 오류:', error);
    throw new Error('사용자 이미지를 가져오는데 실패했습니다.');
  }
}

// 기존 데이터 정리 함수 (필드명 통일 및 오류 데이터 수정)
export async function cleanupImageData(): Promise<void> {
  try {
    console.log('데이터 정리 시작...');
    
    const imagesRef = dbRef(rtdb, 'images');
    const snapshot = await get(imagesRef);
    
    if (!snapshot.exists()) {
      console.log('정리할 데이터가 없습니다.');
      return;
    }
    
    const data = snapshot.val();
    const updatePromises: Promise<void>[] = [];
    
    Object.keys(data).forEach(key => {
      const imageData = data[key];
      
      // 필드명 통일 및 데이터 검증
      const battleCount = Math.max(
        imageData.battleCount || 0,
        imageData.battlesCount || 0
      );
      
      const winCount = Math.min(
        Math.max(imageData.winCount || 0, imageData.winsCount || 0),
        battleCount // 승수는 배틀수를 초과할 수 없음
      );
      
      // 데이터 업데이트가 필요한 경우
      if (
        imageData.battlesCount !== undefined ||
        imageData.winsCount !== undefined ||
        winCount > battleCount ||
        !imageData.battleCount ||
        !imageData.winCount
      ) {
        console.log(`데이터 정리: ${imageData.userName} - ${battleCount}전 ${winCount}승`);
        
        const imageRef = dbRef(rtdb, `images/${key}`);
        updatePromises.push(
          update(imageRef, {
            battleCount: battleCount,
            winCount: winCount,
            lossCount: battleCount - winCount,
            // 기존 잘못된 필드 제거
            battlesCount: null,
            winsCount: null
          })
        );
      }
    });
    
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(`${updatePromises.length}개 이미지 데이터 정리 완료`);
    } else {
      console.log('정리가 필요한 데이터가 없습니다.');
    }
    
  } catch (error) {
    console.error('데이터 정리 중 오류:', error);
    throw new Error('데이터 정리에 실패했습니다.');
  }
} 