'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

const DEFAULT_ZOOM_SCALE = 2.4;
const PINNED_ZOOM_MULTIPLIER = 1.25;
const LIGHTBOX_MIN_ZOOM = 2.2;

type ProductMainImageZoomProps = {
  src: string;
  alt: string;
  children?: ReactNode;
  sizes?: string;
  width?: number;
  height?: number;
  zoomScale?: number;
  enableClickToggle?: boolean;
  zoomInLabel?: string;
  zoomOutLabel?: string;
  variant?: 'preview' | 'lightbox';
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export default function ProductMainImageZoom({
  src,
  alt,
  children,
  sizes = '1600px',
  width = 1600,
  height = 2000,
  zoomScale = DEFAULT_ZOOM_SCALE,
  enableClickToggle = false,
  zoomInLabel,
  zoomOutLabel,
  variant = 'preview',
}: ProductMainImageZoomProps) {
  const canHoverRef = useRef(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const isLightbox = variant === 'lightbox';
  const isZoomed = isPinned || isHovering;
  const previewScale = isPinned ? zoomScale * PINNED_ZOOM_MULTIPLIER : zoomScale;

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => {
      canHoverRef.current = media.matches;
    };

    update();
    media.addEventListener('change', update);

    return () => {
      media.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    setIsHovering(false);
    setIsPinned(false);
    setOrigin({ x: 50, y: 50 });
    setPan({ x: 0, y: 0 });
  }, [src]);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      setFrameSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(frame);

    return () => {
      observer.disconnect();
    };
  }, [src, isLightbox]);

  const updatePointer = useCallback(
    (clientX: number, clientY: number) => {
      const frame = frameRef.current;

      if (!frame) {
        return;
      }

      const rect = frame.getBoundingClientRect();
      const xRatio = clamp((clientX - rect.left) / rect.width);
      const yRatio = clamp((clientY - rect.top) / rect.height);

      setOrigin({ x: xRatio * 100, y: yRatio * 100 });

      if (!isLightbox) {
        return;
      }

      const zoomedWidth = Math.max(naturalSize.width, rect.width * LIGHTBOX_MIN_ZOOM);
      const zoomedHeight = Math.max(naturalSize.height, rect.height * LIGHTBOX_MIN_ZOOM);
      const overflowX = Math.max(0, zoomedWidth - rect.width);
      const overflowY = Math.max(0, zoomedHeight - rect.height);

      setPan({
        x: -overflowX * xRatio,
        y: -overflowY * yRatio,
      });
    },
    [isLightbox, naturalSize.height, naturalSize.width],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      updatePointer(event.clientX, event.clientY);
    },
    [updatePointer],
  );

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      updatePointer(event.clientX, event.clientY);

      if (!canHoverRef.current) {
        return;
      }

      setIsHovering(true);
    },
    [updatePointer],
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);

    if (canHoverRef.current) {
      setIsPinned(false);
    }
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enableClickToggle) {
        return;
      }

      event.stopPropagation();
      updatePointer(event.clientX, event.clientY);
      setIsPinned((prev) => !prev);
    },
    [enableClickToggle, updatePointer],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!enableClickToggle) {
        return;
      }

      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      setIsPinned((prev) => !prev);
    },
    [enableClickToggle],
  );

  const lightboxWidth = Math.max(
    naturalSize.width,
    (frameSize.width || width) * LIGHTBOX_MIN_ZOOM,
  );
  const lightboxHeight = Math.max(
    naturalSize.height,
    (frameSize.height || height) * LIGHTBOX_MIN_ZOOM,
  );

  return (
    <div
      ref={frameRef}
      className={`absolute inset-0 overflow-hidden ${
        isPinned
          ? 'cursor-zoom-out'
          : '[@media(hover:hover)_and_(pointer:fine)]:cursor-zoom-in'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={enableClickToggle ? 'button' : undefined}
      tabIndex={enableClickToggle ? 0 : undefined}
      aria-pressed={enableClickToggle ? isPinned : undefined}
      aria-label={
        enableClickToggle ? (isPinned ? zoomOutLabel : zoomInLabel) : undefined
      }
    >
      {isLightbox ? (
        <Image
          src={src}
          alt={alt}
          width={isZoomed ? lightboxWidth : width}
          height={isZoomed ? lightboxHeight : height}
          quality={100}
          unoptimized
          sizes="100vw"
          onLoad={(event) => {
            setNaturalSize({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            });
          }}
          className="pointer-events-none max-w-none select-none"
          style={
            isZoomed
              ? {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: lightboxWidth,
                  height: lightboxHeight,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  objectFit: 'cover',
                  transform: `translate(${pan.x}px, ${pan.y}px)`,
                }
              : {
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }
          }
          draggable={false}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center p-4 sm:p-6"
          style={{
            transform: isZoomed ? `scale(${previewScale})` : 'scale(1)',
            transformOrigin: `${origin.x}% ${origin.y}%`,
            transition: isZoomed ? 'transform 80ms linear' : 'transform 280ms ease-out',
            willChange: isZoomed ? 'transform' : undefined,
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            quality={90}
            sizes={sizes}
            className="h-auto max-h-full w-auto max-w-full select-none object-contain"
            draggable={false}
          />
        </div>
      )}
      {children}
    </div>
  );
}
