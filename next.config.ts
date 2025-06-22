import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configuración para imágenes externas que pueden venir de n8n
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite cualquier dominio HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Permite cualquier dominio HTTP (para desarrollo)
      }
    ],
    // Optimización de imágenes
    formats: ['image/webp', 'image/avif'],
    // Tamaños de imagen para responsive
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
