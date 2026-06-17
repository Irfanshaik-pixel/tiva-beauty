import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function LazyImage({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "", 
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only set up observer if we haven't loaded the image yet
    if (isLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Stop observing once it's in view
          }
        });
      },
      {
        rootMargin: "150px", // Start loading slightly before it comes into view
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLoaded]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${containerClassName}`}
    >
      {/* 
        Frosted Glass / Blur-Up Placeholder 
        This is always rendered underneath the actual image.
        When the image loads and fades in, this becomes hidden behind it.
      */}
      <div 
        className="absolute inset-0 bg-beige/20 backdrop-blur-3xl overflow-hidden pointer-events-none"
      >
        {/* Subtle shimmering effect inside the glass */}
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5, 
            ease: "linear" 
          }}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />
      </div>

      {/* The actual image */}
      {isInView && (
        <motion.img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ 
            opacity: isLoaded ? 1 : 0, 
            filter: isLoaded ? "blur(0px)" : "blur(20px)" 
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-10 w-full h-full object-cover ${className}`}
          {...props}
        />
      )}
    </div>
  );
}
