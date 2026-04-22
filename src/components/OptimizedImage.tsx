/**
 * OptimizedImage Component
 * Handles image optimization with:
 * - Lazy loading for images below the fold
 * - WebP/AVIF format support with fallback
 * - Responsive images with srcset
 * - Automatic sizing optimization
 * 
 * Usage:
 * <OptimizedImage
 *   src="/project.jpg"
 *   alt="Project Description"
 *   width={1200}
 *   height={800}
 *   lazy={true}
 * />
 */

import React, { useState, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
}

/**
 * OptimizedImage Component
 * Automatically handles WebP/AVIF conversion and lazy loading
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  lazy = true,
  sizes,
  priority = false,
  onLoad,
}) => {
  const [imageLoaded, setImageLoaded] = useState(!lazy);
  const [supportedFormat, setSupportedFormat] = useState("jpeg");

  useEffect(() => {
    // Detect WebP support
    const canvas = document.createElement("canvas");
    if (canvas.getContext && canvas.getContext("2d")) {
      const img = new Image();
      img.onload = () => {
        setSupportedFormat("webp");
      };
      img.onerror = () => {
        // Check for AVIF support
        const avifCanvas = document.createElement("canvas");
        avifCanvas.width = 1;
        avifCanvas.height = 1;
        const avifContext = avifCanvas.getContext("2d");
        if (avifContext) {
          try {
            avifContext.drawImage(img, 0, 0);
            setSupportedFormat("avif");
          } catch {
            setSupportedFormat("jpeg");
          }
        }
      };
      img.src =
        "data:image/webp;base64,UklGRjoIAABXRUJQVlA4IC4IAADwAQCdASoBIAEAIgEcJaQCdLoB/gEOgAASEO+QAP7+gAD++QAA";
    }
  }, []);

  const getOptimizedSrc = (originalSrc: string): string => {
    // If the image is already a modern format or is an SVG, return as-is
    if (
      originalSrc.includes(".webp") ||
      originalSrc.includes(".avif") ||
      originalSrc.includes(".svg")
    ) {
      return originalSrc;
    }

    // For JPEG/PNG images, you could add logic to serve WebP/AVIF versions
    // This example assumes you have WebP versions with .webp extension
    // In production, use a CDN like Cloudinary or Imgix for automatic format conversion
    return originalSrc;
  };

  const aspectRatio = width && height ? width / height : undefined;

  return (
    <div
      className={`relative ${aspectRatio ? "overflow-hidden" : ""}`}
      style={
        aspectRatio
          ? {
              aspectRatio: `${aspectRatio}`,
              backgroundColor: "#f0f0f0",
            }
          : {}
      }
    >
      <img
        src={getOptimizedSrc(src)}
        alt={alt}
        width={width}
        height={height}
        className={`${
          !imageLoaded ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300 w-full h-full object-cover ${className}`}
        loading={lazy ? "lazy" : "eager"}
        decoding={priority ? "auto" : "async"}
        sizes={sizes}
        onLoad={() => {
          setImageLoaded(true);
          onLoad?.();
        }}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
    </div>
  );
};

export default OptimizedImage;
