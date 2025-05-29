'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: '홈', href: '/', icon: '🏠' },
    { name: '랭킹', href: '/ranking', icon: '🏆' },
    { name: '대결', href: '/battle', icon: '⚔️' },
    { name: '시뮬레이션', href: '/simulation', icon: '🔬' },
    { name: '업로드', href: '/upload', icon: '📸' },
  ];

  const legalLinks = [
    { name: '이용약관', href: '/terms' },
    { name: '개인정보처리방침', href: '/privacy' },
  ];

  const handleNavigation = (href: string) => {
    if (href === '/upload') {
      // 업로드 페이지는 성별 선택이 필요하므로 홈으로 이동
      router.push('/');
    } else {
      router.push(href);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative z-50 bg-purple-900/80 backdrop-blur-sm border-b border-purple-400/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="text-2xl mr-2">✨</div>
            <h1 className="text-xl md:text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 font-bold">
              얼굴대결
            </h1>
          </div>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden lg:flex items-center space-x-6">
            <nav className="flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${pathname === item.href
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-purple-700/50'
                    }
                  `}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </nav>
            
            {/* 법적 문서 링크 */}
            <div className="flex items-center space-x-4 border-l border-purple-400/30 pl-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs text-purple-300 hover:text-purple-100 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 중간 크기 화면용 네비게이션 */}
          <nav className="hidden md:flex lg:hidden space-x-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${pathname === item.href
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-purple-700/50'
                  }
                `}
              >
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 rounded-lg text-purple-200 hover:text-white hover:bg-purple-700/50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-purple-900/95 backdrop-blur-sm border-b border-purple-400/30 shadow-xl">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                    ${pathname === item.href
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-purple-700/50'
                    }
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              ))}
              
              {/* 모바일 법적 문서 링크 */}
              <div className="border-t border-purple-400/30 pt-2 mt-2">
                {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-purple-300 hover:text-purple-100 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 