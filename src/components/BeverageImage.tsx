import { useState } from 'react';
import { Coffee } from 'lucide-react';

interface BeverageImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function BeverageImage({ src, alt, className = '' }: BeverageImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F2ECE1] via-[#FAF7F2] to-[#FCE7D6] text-[#5E4536] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Coffee className="w-8 h-8 text-[#EA580C] mb-2" strokeWidth={1.75} />
        <span className="text-xs font-medium text-[#2B1B12] line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}
