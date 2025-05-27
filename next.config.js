/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // 클라이언트 사이드 번들링 중일 때
    if (!isServer) {
      // fs 모듈과 같은 Node.js 전용 모듈이 클라이언트 사이드 번들에 포함되지 않도록 설정
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 