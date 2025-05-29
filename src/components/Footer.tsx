'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-purple-900/90 backdrop-blur-sm border-t border-purple-400/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 서비스 정보 */}
          <div>
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-2">✨</div>
              <h3 className="text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 font-bold">
                마법의 거울
              </h3>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              AI 기반 얼굴 분석 및 미모 대결 서비스<br/>
              당신의 진정한 아름다움을 발견하세요
            </p>
            <div className="mt-4 p-3 bg-purple-800/50 rounded-lg">
              <p className="text-purple-100 text-xs font-semibold">🔒 개인정보 보호</p>
              <p className="text-purple-200 text-xs mt-1">
                얼굴 이미지는 서비스 제공을 위해 안전하게 보관됩니다
              </p>
            </div>
          </div>

          {/* 법적 문서 및 정책 */}
          <div>
            <h4 className="text-lg font-semibold text-purple-100 mb-4">법적 문서</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/terms" 
                  className="text-purple-200 hover:text-purple-100 text-sm transition-colors duration-200"
                >
                  📋 서비스 이용약관
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-purple-200 hover:text-purple-100 text-sm transition-colors duration-200"
                >
                  🔐 개인정보처리방침
                </Link>
              </li>
            </ul>
            
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-purple-100 mb-2">개인정보 처리 안내</h5>
              <ul className="text-xs text-purple-300 space-y-1">
                <li>• 생체정보(얼굴) 처리 동의 필수</li>
                <li>• 서비스 목적 외 사용 금지</li>
                <li>• 서비스 제공을 위해 안전하게 보관</li>
                <li>• 사용자 요청 시 즉시 삭제 처리</li>
              </ul>
            </div>
          </div>

          {/* 연락처 및 문의 */}
          <div>
            <h4 className="text-lg font-semibold text-purple-100 mb-4">문의 및 지원</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-purple-100">개인정보보호책임자</p>
                <p className="text-sm text-purple-200">privacy@facebattle.com</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-purple-100">서비스 문의</p>
                <p className="text-sm text-purple-200">support@facebattle.com</p>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-200 text-xs font-semibold">⚠️ 개인정보 관련 문의</p>
                <p className="text-yellow-100 text-xs mt-1">
                  개인정보 처리 정지, 삭제 요청 등은<br/>
                  개인정보보호책임자에게 연락해 주세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 저작권 정보 */}
        <div className="border-t border-purple-400/30 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-purple-300 text-xs">
              © 2024 마법의 거울. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <p className="text-purple-400 text-xs">
                개인정보처리방침 최종 수정: 2024.01.01
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-300 text-xs">서비스 정상 운영</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 