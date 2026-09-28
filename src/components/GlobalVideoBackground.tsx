'use client';

import React, { useEffect, useRef } from 'react';

export default function GlobalVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    let targetTime = 0;
    let currentTime = 0;
    let animId: number;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;

      if (maxScroll > 0 && video.duration) {
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        targetTime = progress * video.duration;
      }
    };

    const handleLoadedMetadata = () => {
      handleScroll();
    };

    if (video.readyState >= 1) {
      handleScroll();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Silky smooth Lerp loop: eliminates video decode jitter on rapid scroll
    const lerpLoop = () => {
      if (video && video.duration && video.readyState >= 2) {
        const diff = targetTime - currentTime;
        if (Math.abs(diff) > 0.001) {
          currentTime += diff * 0.12; // buttery smooth easing
          video.currentTime = currentTime;
        }
      }
      animId = requestAnimationFrame(lerpLoop);
    };

    animId = requestAnimationFrame(lerpLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="global-video-bg">
      <video
        ref={videoRef}
        src="/video/Hand_pouring_coffee_beans_into_20260927124630.mp4"
        playsInline
        muted
        preload="auto"
        className="fixed-video"
      />
      {/* Cinematic contrast overlay: preserves legibility while keeping the video richly visible */}
      <div className="fixed-vignette" />
      <div className="fixed-ambient-glow" />

      <style jsx>{`
        .global-video-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: #0B0806;
        }

        .fixed-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .fixed-vignette {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at center, rgba(11, 8, 6, 0.42) 0%, rgba(11, 8, 6, 0.78) 75%, rgba(11, 8, 6, 0.95) 100%),
            linear-gradient(180deg, rgba(11, 8, 6, 0.8) 0%, rgba(11, 8, 6, 0.25) 25%, rgba(11, 8, 6, 0.25) 75%, rgba(11, 8, 6, 0.85) 100%);
        }

        .fixed-ambient-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 20%, rgba(223, 183, 117, 0.08) 0%, transparent 60%);
        }
      `}</style>
    </div>
  );
}
