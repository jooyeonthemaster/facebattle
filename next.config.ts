import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // 클라이언트 사이드 번들링 중일 때
    if (!isServer) {
      // fs 모듈과 같은 Node.js 전용 모듈이 클라이언트 사이드 번들에 포함되지 않도록 설정
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
