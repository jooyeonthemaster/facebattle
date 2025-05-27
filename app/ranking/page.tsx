'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getTopRankedImages } from '@/src/lib/firebaseService';
import { Image as ImageType } from '@/src/types';

export default function RankingPage() {
  const router = useRouter();
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all');
  
  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        setIsLoading(true);
        // 성별에 따라 상위 랭킹 이미지 가져오기
        const genderFilter = selectedGender === 'all' ? undefined : selectedGender;
        const topImages = await getTopRankedImages(10, genderFilter);
        
        // 디버깅 정보 출력
        console.log('선택된 성별:', selectedGender);
        console.log('성별 필터:', genderFilter);
        console.log('가져온 이미지들:', topImages);
        console.log('이미지 개수:', topImages.length);
        
        setImages(topImages);
      } catch (err) {
        console.error('랭킹 데이터 가져오기 중 오류:', err);
        setError('랭킹 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRankingData();
  }, [selectedGender]);
  
  const getWinRate = (image: ImageType) => {
    if (image.battleCount === 0) return 0;
    return (image.winCount / image.battleCount) * 100;
  };
  
  const handleStartNewBattle = () => {
    router.push('/upload');
  };
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-4">오류 발생</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={handleStartNewBattle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            새 대결 시작하기
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">얼굴 평가 랭킹</h1>
      
      {/* 성별 탭 */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setSelectedGender('all')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedGender === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedGender('male')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedGender === 'male'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👨 남성
          </button>
          <button
            onClick={() => setSelectedGender('female')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedGender === 'female'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👩 여성
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">랭킹 데이터를 불러오는 중...</p>
        </div>
      ) : (
        <>
          {images.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">아직 랭킹 데이터가 없습니다</h2>
              <p className="text-gray-600 mb-6">
                더 많은 사용자들이 얼굴 평가 대결에 참여하면 랭킹이 생성됩니다.
              </p>
              <button
                onClick={handleStartNewBattle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                첫 번째 대결 시작하기
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        순위
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사용자
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이미지
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        평균 점수
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        승률
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        대결 수
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {images.map((image, index) => (
                      <tr key={image.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`
                              rounded-full w-8 h-8 flex items-center justify-center font-bold text-white
                              ${index === 0 ? 'bg-yellow-500' : 
                                index === 1 ? 'bg-gray-400' : 
                                index === 2 ? 'bg-amber-600' : 'bg-blue-500'}
                            `}>
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{image.userName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              src={image.imageUrl}
                              alt={`${image.userName}의 이미지`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{image.analysis.averageScore.toFixed(1)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getWinRate(image).toFixed(1)}%</div>
                          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${getWinRate(image)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {image.battleCount}회 중 {image.winCount}승
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleStartNewBattle}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  새 대결 시작하기
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 