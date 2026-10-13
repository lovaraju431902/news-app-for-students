"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, ArrowLeft, ArrowRight, X } from "lucide-react";

export type WebstoryType = {
  id: string;
  title: string;
  image: string;
  video?: string | null;
  href?: string | null;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

interface ShortVideoCardProps {
  story: WebstoryType;
  onClick: () => void;
}

export function ShortVideoCard({ story, onClick }: ShortVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && story.video) {
      // Small timeout to prevent play/pause race condition on quick mouse movements
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.debug("Hover autoplay prevented:", err);
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-800 bg-slate-950 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
    >
      {/* Video element for hover play, fallback to Image */}
      {story.video ? (
        <>
          <video
            ref={videoRef}
            src={story.video}
            poster={story.image}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            muted
            loop
            playsInline
          />
          {/* Static Cover Image */}
          <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          >
            {story.image ? (
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                No Thumbnail
              </div>
            )}
          </div>
        </>
      ) : (
        story.image ? (
          <Image
            src={story.image}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
            No Thumbnail
          </div>
        )
      )}

      {/* Play Icon Overlay on Top Right */}
      {story.video && !isHovered && (
        <div className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 backdrop-blur-md">
          <Play className="w-3 h-3 fill-current translate-x-[0.5px]" />
        </div>
      )}

      {/* Bottom Text Overlay with Gradient */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-12 flex flex-col justify-end">
        <h3 className="text-white font-bold text-xs sm:text-sm leading-snug line-clamp-3 group-hover:text-red-400 transition-colors">
          {story.title}
        </h3>
      </div>
    </div>
  );
}

interface ShortVideoPlayerModalProps {
  stories: WebstoryType[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ShortVideoPlayerModal({
  stories,
  currentIndex,
  onClose,
  onNavigate,
}: ShortVideoPlayerModalProps) {
  const currentStory = stories[currentIndex];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset states when story changes
    setIsPlaying(true);
    setProgress(0);
    
    // Auto-unmute or respect current volume state
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.debug("Modal video autoplay prevented:", err);
          setIsPlaying(false);
        });
      }
    }

    // Keyboard listener for navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev(e as any);
      if (e.key === "ArrowRight") handleNext(e as any);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => console.error(err));
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const handleVideoEnded = () => {
    if (currentIndex < stories.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => console.error(err));
      }
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  if (!currentStory) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4 select-none"
      onClick={onClose}
    >
      {/* Desktop Close Button (top-right) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-zinc-900/60 hover:bg-zinc-800 text-white transition-colors cursor-pointer border border-zinc-700/30 hidden sm:flex"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Container */}
      <div
        className="relative w-full max-w-[420px] h-full sm:h-[85vh] sm:max-h-[750px] aspect-[9/16] bg-zinc-950 sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex flex-col gap-2">
          {/* Progress Segment */}
          <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
            <div
              className="bg-red-600 h-full rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white mt-1">
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 sm:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 px-3 text-xs font-bold truncate">
              {currentStory.title}
            </div>
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div
          className="relative flex-grow h-full bg-black flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          {currentStory.video ? (
            <video
              ref={videoRef}
              src={currentStory.video}
              poster={currentStory.image}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
            />
          ) : (
            currentStory.image && (
              <Image
                src={currentStory.image}
                alt={currentStory.title}
                fill
                className="object-cover"
                unoptimized
              />
            )
          )}

          {/* Pause Indicator overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="p-4 rounded-full bg-black/60 text-white scale-110 transition-transform">
                <Play className="w-8 h-8 fill-current translate-x-[1px]" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Metadata Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-30 p-5 bg-gradient-to-t from-black/95 via-black/50 to-transparent text-white pt-16 pointer-events-none">
          <p className="text-sm font-semibold leading-snug line-clamp-3 mb-2">
            {currentStory.title}
          </p>
          {currentStory.href && (
            <a
              href={currentStory.href}
              className="inline-flex items-center text-xs text-red-400 font-bold hover:underline pointer-events-auto"
            >
              Learn More &rarr;
            </a>
          )}
        </div>

        {/* Desktop Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-[-55px] top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700/50 hidden sm:flex cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-[-55px] top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700/50 hidden sm:flex cursor-pointer transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tap zones for navigation on mobile */}
      <div
        className="absolute top-1/3 bottom-1/5 left-0 w-1/4 z-20 sm:hidden cursor-pointer"
        onClick={handlePrev}
      />
      <div
        className="absolute top-1/3 bottom-1/5 right-0 w-1/4 z-20 sm:hidden cursor-pointer"
        onClick={handleNext}
      />
    </div>
  );
}
