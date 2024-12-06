// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };
// const nextConfig = {
//   experimental: {
//     ppr: 'incremental',
//   },
// };

// export default nextConfig;

// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   experimental: {
//     ppr: 'incremental', // Включение PPR в режиме инкрементального рендеринга
//   },
// };

// export default nextConfig;

// const nextConfig = {
//   experimental: {
//     ppr: 'incremental',
//   },
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     ppr: 'incremental',
//   },
//   eslint: {
//     ignoreDuringBuilds: true, // Временно игнорируем ошибки ESLint при сборке
//   },
// };

// export default nextConfig;

const nextConfig = {
  experimental: {
    ppr: 'incremental',
    typedRoutes: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Временно игнорируем ошибки TypeScript при сборке
  },
  eslint: {
    ignoreDuringBuilds: true, // Временно игнорируем ошибки ESLint при сборке
  },
};

export default nextConfig;
