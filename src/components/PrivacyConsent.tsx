'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PrivacyConsentProps {
  onConsentChange: (consents: ConsentState) => void;
  isVisible: boolean;
}

export interface ConsentState {
  termsOfService: boolean;
  privacyPolicy: boolean;
  biometricData: boolean;
  marketing: boolean;
  allRequired: boolean;
}

export default function PrivacyConsent({ onConsentChange, isVisible }: PrivacyConsentProps) {
  const [consents, setConsents] = useState<ConsentState>({
    termsOfService: false,
    privacyPolicy: false,
    biometricData: false,
    marketing: false,
    allRequired: false,
  });

  const handleConsentChange = (key: keyof ConsentState, value: boolean) => {
    const newConsents = { ...consents, [key]: value };
    
    // 전체 필수 동의 상태 업데이트
    newConsents.allRequired = newConsents.termsOfService && 
                              newConsents.privacyPolicy && 
                              newConsents.biometricData;
    
    setConsents(newConsents);
    onConsentChange(newConsents);
  };

  const handleAllRequiredChange = (value: boolean) => {
    const newConsents = {
      termsOfService: value,
      privacyPolicy: value,
      biometricData: value,
      marketing: consents.marketing, // 선택사항은 유지
      allRequired: value,
    };
    
    setConsents(newConsents);
    onConsentChange(newConsents);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-purple-900/20 backdrop-blur-sm border-2 border-purple-400/30 rounded-xl p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-serif text-purple-100 mb-2 flex items-center">
          🛡️ 개인정보 처리 동의
        </h3>
        <p className="text-sm text-purple-200">
          서비스 이용을 위해 필요한 최소한의 동의를 진행해주세요
        </p>
      </div>

      <div className="space-y-3">
        {/* 전체 필수 동의 */}
        <div className="p-3 bg-gradient-to-r from-purple-700/30 to-pink-700/30 border border-purple-400/40 rounded-lg">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-purple-600/20 p-2 rounded transition-colors"
            onClick={() => handleAllRequiredChange(!consents.allRequired)}
          >
            {/* 커스텀 체크박스 */}
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              consents.allRequired 
                ? 'bg-purple-500 border-purple-500' 
                : 'bg-transparent border-purple-300 hover:border-purple-400'
            }`}>
              {consents.allRequired && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <span className="font-serif text-purple-100 font-semibold">
                ✨ 필수 약관 전체 동의
              </span>
              <p className="text-xs text-purple-200 mt-1">
                서비스 이용약관, 개인정보처리방침, 생체정보 처리 동의
              </p>
            </div>
          </div>
        </div>

        {/* 개별 동의 항목들 */}
        <div className="space-y-3 text-sm">
          <div 
            className="flex items-center space-x-3 cursor-pointer text-purple-200 hover:text-purple-100 hover:bg-purple-800/20 p-2 rounded transition-colors"
            onClick={() => handleConsentChange('termsOfService', !consents.termsOfService)}
          >
            {/* 커스텀 체크박스 */}
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              consents.termsOfService 
                ? 'bg-purple-500 border-purple-500' 
                : 'bg-transparent border-purple-300 hover:border-purple-400'
            }`}>
              {consents.termsOfService && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="flex-1">[필수] 서비스 이용약관</span>
            <Link 
              href="/terms" 
              target="_blank" 
              className="text-purple-300 hover:text-purple-100 underline text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              보기
            </Link>
          </div>

          <div 
            className="flex items-center space-x-3 cursor-pointer text-purple-200 hover:text-purple-100 hover:bg-purple-800/20 p-2 rounded transition-colors"
            onClick={() => handleConsentChange('privacyPolicy', !consents.privacyPolicy)}
          >
            {/* 커스텀 체크박스 */}
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              consents.privacyPolicy 
                ? 'bg-purple-500 border-purple-500' 
                : 'bg-transparent border-purple-300 hover:border-purple-400'
            }`}>
              {consents.privacyPolicy && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="flex-1">[필수] 개인정보처리방침</span>
            <Link 
              href="/privacy" 
              target="_blank" 
              className="text-purple-300 hover:text-purple-100 underline text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              보기
            </Link>
          </div>

          <div 
            className="flex items-center space-x-3 cursor-pointer text-purple-200 hover:text-purple-100 hover:bg-purple-800/20 p-2 rounded transition-colors"
            onClick={() => handleConsentChange('biometricData', !consents.biometricData)}
          >
            {/* 커스텀 체크박스 */}
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              consents.biometricData 
                ? 'bg-purple-500 border-purple-500' 
                : 'bg-transparent border-purple-300 hover:border-purple-400'
            }`}>
              {consents.biometricData && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="flex-1">[필수] 생체정보(얼굴) 처리 동의</span>
          </div>

          <div 
            className="flex items-center space-x-3 cursor-pointer text-purple-300 hover:text-purple-200 hover:bg-purple-800/20 p-2 rounded transition-colors"
            onClick={() => handleConsentChange('marketing', !consents.marketing)}
          >
            {/* 커스텀 체크박스 */}
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              consents.marketing 
                ? 'bg-purple-500 border-purple-500' 
                : 'bg-transparent border-purple-300 hover:border-purple-400'
            }`}>
              {consents.marketing && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="flex-1">[선택] 마케팅 정보 수신</span>
          </div>
        </div>

        {/* 간단한 안내 */}
        <div className="mt-4 p-3 bg-purple-800/30 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-200 flex items-start space-x-2">
            <span>💡</span>
            <span>
              업로드된 이미지는 AI 분석 목적으로만 사용되며, 
              사용자 요청시 언제든 삭제됩니다. 타인의 이미지 무단 사용은 금지됩니다.
            </span>
          </p>
        </div>

        {/* 동의 상태 표시 */}
        <div className="text-center">
          {consents.allRequired ? (
            <p className="text-green-300 font-serif text-sm">
              ✅ 필수 동의 완료! 서비스 이용이 가능합니다.
            </p>
          ) : (
            <p className="text-yellow-300 font-serif text-sm">
              ⚠️ 필수 약관 동의가 필요합니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 