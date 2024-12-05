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

const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
};

export default nextConfig;
