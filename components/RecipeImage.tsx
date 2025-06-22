'use client';

import Image from 'next/image';
import { useState } from 'react';

interface RecipeImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function RecipeImage({ 
  src, 
  alt, 
  className = '', 
  priority = false 
}: RecipeImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Imagen por defecto cuando hay error
  const fallbackImage = '/placeholder-recipe.jpg';

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`w-full relative aspect-video ${className} rounded-t-2xl overflow-hidden mask-b-from-70% mask-b-to-99%`}>
      {isLoading && (
        <div 
          className="absolute inset-28 bg-gray-200 animate-pulse flex items-center justify-center z-10"
        >
          <div className="text-gray-400 text-sm">Cargando...</div>
        </div>
      )}
      
      <Image
        src={imageError ? fallbackImage : src}
        alt={alt}
        fill
        className={`object-cover transition-discrete duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-500 z-10">
          <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Imagen no disponible</span>
        </div>
      )}
    </div>
  );
} 