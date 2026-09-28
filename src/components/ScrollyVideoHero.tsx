'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, ChevronDown, Compass, Award, Sparkles, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CHAPTERS = [
  { id: 1, title: 'Початок', subtitle: 'High-Altitude Terroir', progress: 0.05 },
  { id: 2, title: 'Відбір', subtitle: 'Handcrafted Grading', progress: 0.35 },
  { id: 3, title: 'Обсмаження', subtitle: 'Artisan Drum Roasting', progress: 0.65 },
  { id: 4, title: 'Ритуал', subtitle: 'Peak Freshness Ritual', progress: 0.92 },
];

interface ScrollyVideoHeroProps {
  onExploreClick: () => void;
}

export default function ScrollyVideoHero({ onExploreClick }: ScrollyVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Smooth lerp tracking for video currentTime
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Setup GSAP ScrollTrigger and video scrubbing
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!container || !video) return;

    // Ensure video properties
    video.muted = isMuted;
    video.playsInline = true;
    video.pause();

    const onMeta = () => {
      setVideoLoaded(true);
    };

    if (video.readyState >= 1) {
      setVideoLoaded(true);
    } else {
      video.addEventListener('loadedmetadata', onMeta);
    }

    // GSAP ScrollTrigger instance
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // Update active chapter based on progress thresholds
        if (p < 0.25) setActiveChapter(1);
        else if (p < 0.52) setActiveChapter(2);
        else if (p < 0.78) setActiveChapter(3);
        else setActiveChapter(4);

        if (!isAutoPlay && video.duration) {
          targetTimeRef.current = p * video.duration;
        }
      },
    });

    // Lerp loop for silky smooth video frames (avoids decode stutter on fast wheel ticks)
    const lerpLoop = () => {
      if (!isAutoPlay && video && video.duration && video.readyState >= 2) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) > 0.002) {
          currentTimeRef.current += diff * 0.14; // smooth easing
          video.currentTime = currentTimeRef.current;
        }
      }
      animationFrameRef.current = requestAnimationFrame(lerpLoop);
    };

    animationFrameRef.current = requestAnimationFrame(lerpLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      video.removeEventListener('loadedmetadata', onMeta);
      st.kill();
    };
  }, [isAutoPlay, isMuted]);

  // Handle Autoplay toggle
  const toggleAutoPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isAutoPlay) {
      video.play();
      setIsAutoPlay(true);
    } else {
      video.pause();
      setIsAutoPlay(false);
      if (video.duration) {
        targetTimeRef.current = scrollProgress * video.duration;
        currentTimeRef.current = video.currentTime;
      }
    }
  };

  // Scroll smoothly to chapter
  const scrollToChapter = (targetProgress: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerTop = container.offsetTop;
    const containerHeight = container.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollable = containerHeight - viewportHeight;
    const targetScrollY = containerTop + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  // Stage visibility calculation
  const stage1Opacity = Math.max(0, Math.min(1, 1 - scrollProgress * 4.5));
  const stage2Opacity =
    scrollProgress >= 0.22 && scrollProgress <= 0.52
      ? Math.sin(((scrollProgress - 0.22) / 0.3) * Math.PI)
      : 0;
  const stage3Opacity =
    scrollProgress >= 0.50 && scrollProgress <= 0.78
      ? Math.sin(((scrollProgress - 0.5) / 0.28) * Math.PI)
      : 0;
  const stage4Opacity =
    scrollProgress >= 0.75 ? Math.min(1, (scrollProgress - 0.75) * 4) : 0;

  return (
    <section ref={containerRef} className="scrolly-container" id="story">
      {/* Sticky Viewport */}
      <div ref={stickyRef} className="scrolly-sticky">
        {/* Background Video Layer */}
        <div className="video-wrapper">
          <video
            ref={videoRef}
            src="/video/Hand_pouring_coffee_beans_into_20260927124630.mp4"
            className="video-element"
            playsInline
            muted={isMuted}
            preload="auto"
            loop={isAutoPlay}
          />
        </div>

        {/* Master Dark/Espresso Vignette & Multi-gradient Overlays for contrast */}
        <div className="scrolly-vignette" />
        <div className="scrolly-mesh-overlay" />

        {/* Top brand ambient indicator */}
        <div className="top-status-bar">
          <div className="craft-badge">
            <span className="pulsing-amber-dot" />
            <span>SPECIALTY LOT • CROP 2026</span>
          </div>
          <div className="mode-indicators">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="control-chip"
              title={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span className="chip-label">{isMuted ? 'Muted' : 'Sound On'}</span>
            </button>
            <button
              onClick={toggleAutoPlay}
              className={`control-chip ${isAutoPlay ? 'active' : ''}`}
              title="Перемкнути режим"
            >
              {isAutoPlay ? <Pause size={15} /> : <Play size={15} />}
              <span className="chip-label">{isAutoPlay ? 'Авто-відео' : 'Скрол-синхронізація'}</span>
            </button>
          </div>
        </div>

        {/* Floating Story Stages */}
        <div className="story-content-layer">
          {/* STAGE 1: The Grand Welcome (0% - 22%) */}
          <div
            className="story-stage stage-1"
            style={{
              opacity: stage1Opacity,
              transform: `translateY(${(1 - stage1Opacity) * -30}px) scale(${0.96 + stage1Opacity * 0.04})`,
              pointerEvents: stage1Opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="stage-inner">
              <div className="hero-pill-badge">
                <Sparkles size={14} className="gold-icon" />
                <span>ARTISAN COFFEE ATELIER</span>
              </div>
              <h1 className="hero-main-title">
                СВЯТИЛИЩЕ СПРАВЖНЬОГО <br />
                <span className="text-gold-gradient">КАВОВОГО МИСТЕЦТВА</span>
              </h1>
              <p className="hero-description">
                Високогірні мікролоти арабіки з вулканічних схилів. Ручний відбір стиглих ягід,
                повільне обсмаження на чавунному ростері та доставка в піку свіжості за 48 годин.
              </p>
              <div className="hero-cta-group">
                <button onClick={onExploreClick} className="btn-primary">
                  <Compass size={17} />
                  <span>Дослідити колекцію</span>
                </button>
                <a href="#flavor-wheel" className="btn-secondary">
                  <span>Підібрати смак</span>
                </a>
              </div>

              {/* Bottom Terroir Highlights */}
              <div className="hero-metrics-bar">
                <div className="metric-item">
                  <span className="metric-val">2,150м</span>
                  <span className="metric-lbl">Висота плантацій</span>
                </div>
                <div className="metric-divider" />
                <div className="metric-item">
                  <span className="metric-val">88.5+</span>
                  <span className="metric-lbl">SCA Cupping Score</span>
                </div>
                <div className="metric-divider" />
                <div className="metric-item">
                  <span className="metric-val">48 год</span>
                  <span className="metric-lbl">Свіже обсмаження</span>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 2: Hand Selection & Grading (25% - 50%) */}
          <div
            className="story-stage stage-2"
            style={{
              opacity: stage2Opacity,
              transform: `translateY(${(1 - stage2Opacity) * 30}px)`,
              pointerEvents: stage2Opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="stage-inner">
              <div className="hero-pill-badge">
                <ShieldCheck size={14} className="gold-icon" />
                <span>ЕТАП 01 • СЕЛЕКЦІЙНИЙ ВІДБІР</span>
              </div>
              <h2 className="stage-title">
                КОЖНЕ ЗЕРНО ПРОХОДИТЬ <br />
                <span className="text-gold-gradient">ТРИРІВНЕВИЙ РУЧНИЙ ВІДБІР</span>
              </h2>
              <p className="stage-description">
                Ми відкидаємо до 40% зерен на етапі калібрування. Тільки ідеально стиглі ягоди
                пікерського збору з природною цукристістю 22° Brix потрапляють до чанів анаеробної ферментації.
              </p>

              <div className="feature-cards-grid">
                <div className="feature-card glass-panel">
                  <div className="feature-num">22° Brix</div>
                  <div className="feature-label">Цукристість м’якоті</div>
                  <div className="feature-detail">Максимальна концентрація натуральних фруктових цукрів</div>
                </div>
                <div className="feature-card glass-panel">
                  <div className="feature-num">0.0%</div>
                  <div className="feature-label">Первинних дефектів</div>
                  <div className="feature-detail">Подвійний оптичний та ручний стіл сортування</div>
                </div>
                <div className="feature-card glass-panel">
                  <div className="feature-num">Screen 18+</div>
                  <div className="feature-label">Калібр зерна (Supremo)</div>
                  <div className="feature-detail">Найбільші щільні зерна з високим вмістом аромамасел</div>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 3: Cast-Iron Drum Roasting Alchemy (50% - 75%) */}
          <div
            className="story-stage stage-3"
            style={{
              opacity: stage3Opacity,
              transform: `translateY(${(1 - stage3Opacity) * 30}px)`,
              pointerEvents: stage3Opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="stage-inner">
              <div className="hero-pill-badge">
                <Award size={14} className="gold-icon" />
                <span>ЕТАП 02 • АЛХІМІЯ ОБСМАЖЕННЯ</span>
              </div>
              <h2 className="stage-title">
                ПОВІЛЬНЕ ОБСМАЖЕННЯ НА <br />
                <span className="text-gold-gradient">ЧАВУННОМУ РОСТЕРІ GIESEN</span>
              </h2>
              <p className="stage-description">
                Точний тепловий профіль із дискретністю 0.1°C. Ми ведемо реакцію Майяра до пікової
                карамелізації без жодної зайвої гіркоти, розкриваючи понад 800 унікальних ароматичних сполук.
              </p>

              <div className="flavor-meter-card glass-panel">
                <div className="flavor-bar-row">
                  <span className="bar-label">Оксамитове тіло (Body)</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: '95%' }} />
                  </div>
                  <span className="bar-val">95%</span>
                </div>
                <div className="flavor-bar-row">
                  <span className="bar-label">Шоколад & Трюфель</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: '90%' }} />
                  </div>
                  <span className="bar-val">90%</span>
                </div>
                <div className="flavor-bar-row">
                  <span className="bar-label">Карамельна солодкість</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: '88%' }} />
                  </div>
                  <span className="bar-val">88%</span>
                </div>
                <div className="flavor-bar-row">
                  <span className="bar-label">Ягідна витонченість</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: '84%' }} />
                  </div>
                  <span className="bar-val">84%</span>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 4: The Freshness Ritual & Final CTA (78% - 100%) */}
          <div
            className="story-stage stage-4"
            style={{
              opacity: stage4Opacity,
              transform: `translateY(${(1 - stage4Opacity) * 30}px)`,
              pointerEvents: stage4Opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="stage-inner">
              <div className="hero-pill-badge">
                <Sparkles size={14} className="gold-icon" />
                <span>ЕТАП 03 • ПІК СВІЖОСТІ</span>
              </div>
              <h2 className="stage-title">
                ВАШ БЕЗДОГАННИЙ <br />
                <span className="text-gold-gradient">РАНКОВИЙ РИТУАЛ СВІЖОСТІ</span>
              </h2>
              <p className="stage-description">
                Запечатано в багатошарові пакети з японським клапаном дегазації AromaLock™.
                Відправляємо кожну партію безпосередньо після купінгу, щоб у вашій чашці грав найчистіший смак.
              </p>

              <div className="stage4-actions">
                <button onClick={onExploreClick} className="btn-primary">
                  <span>Обрати свій сорт</span>
                  <ChevronDown size={18} />
                </button>
                <div className="guarantee-chip">
                  <span>✓ Доставка свіжого зерна по Україні за 24–48 год</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Vertical Chapter Rail Navigation */}
        <div className="chapter-nav-rail">
          {CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => scrollToChapter(ch.progress)}
              className={`chapter-step ${activeChapter === ch.id ? 'active' : ''}`}
            >
              <div className="step-indicator">
                <span className="step-dot" />
              </div>
              <div className="step-meta">
                <span className="step-num">0{ch.id}</span>
                <span className="step-title">{ch.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Scroll Cue */}
        {scrollProgress < 0.85 && (
          <div className="scroll-cue">
            <span className="cue-text">Прокрутіть для подорожі зерна</span>
            <div className="mouse-icon">
              <span className="mouse-wheel" />
            </div>
          </div>
        )}

        {/* Bottom Progress Bar */}
        <div className="scrolly-progress-line">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        .scrolly-container {
          position: relative;
          height: 380vh;
          background-color: var(--bg-primary);
        }

        .scrolly-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .scrolly-mesh-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          background: radial-gradient(circle at 50% 50%, transparent 30%, rgba(11, 8, 6, 0.6) 80%);
        }

        .top-status-bar {
          position: absolute;
          top: 88px;
          left: 0;
          width: 100%;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .craft-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(18, 13, 9, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
        }

        .pulsing-amber-dot {
          width: 7px;
          height: 7px;
          background-color: var(--accent-amber);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent-amber);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .mode-indicators {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .control-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          background: rgba(26, 18, 13, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .control-chip:hover {
          color: #ffffff;
          border-color: var(--accent-gold);
        }

        .control-chip.active {
          color: var(--accent-gold);
          border-color: var(--accent-gold);
          background: rgba(223, 183, 117, 0.15);
        }

        .story-content-layer {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
        }

        .story-stage {
          position: absolute;
          max-width: 900px;
          width: 100%;
          text-align: center;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .stage-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(223, 183, 117, 0.12);
          border: 1px solid rgba(223, 183, 117, 0.3);
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--accent-gold);
          margin-bottom: 24px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }

        .hero-main-title {
          font-size: clamp(2.3rem, 5.2vw, 4.4rem);
          line-height: 1.12;
          font-weight: 500;
          color: #FAF6F0;
          margin-bottom: 22px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        }

        .stage-title {
          font-size: clamp(1.9rem, 4.2vw, 3.4rem);
          line-height: 1.18;
          font-weight: 500;
          color: #FAF6F0;
          margin-bottom: 20px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        }

        .hero-description,
        .stage-description {
          font-size: clamp(1rem, 1.3vw, 1.2rem);
          color: #E2D7CC;
          max-width: 680px;
          line-height: 1.7;
          margin-bottom: 34px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 44px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hero-metrics-bar {
          display: flex;
          align-items: center;
          gap: 32px;
          background: rgba(18, 13, 9, 0.75);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: 12px 34px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .metric-val {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-gold);
          font-family: var(--font-serif);
        }

        .metric-lbl {
          font-size: 0.72rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .metric-divider {
          width: 1px;
          height: 28px;
          background: var(--border-subtle);
        }

        /* Stage 2 Cards */
        .feature-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 820px;
        }

        .feature-card {
          padding: 24px 20px;
          text-align: center;
          border-radius: var(--radius-md);
        }

        .feature-num {
          font-size: 1.8rem;
          font-family: var(--font-serif);
          font-weight: 600;
          color: var(--accent-gold);
          margin-bottom: 6px;
        }

        .feature-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .feature-detail {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        /* Stage 3 Bars */
        .flavor-meter-card {
          width: 100%;
          max-width: 640px;
          padding: 26px 30px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .flavor-bar-row {
          display: grid;
          grid-template-columns: 160px 1fr 45px;
          align-items: center;
          gap: 14px;
        }

        .bar-label {
          font-size: 0.85rem;
          color: var(--text-primary);
          text-align: left;
          font-weight: 500;
        }

        .bar-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #A67836 0%, #DFB775 100%);
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(223, 183, 117, 0.5);
        }

        .bar-val {
          font-size: 0.8rem;
          color: var(--accent-gold);
          font-weight: 600;
          text-align: right;
        }

        /* Stage 4 */
        .stage4-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }

        .guarantee-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-gold);
        }

        /* Right Chapter Rail */
        .chapter-nav-rail {
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .chapter-step {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 4px;
          opacity: 0.5;
          transition: var(--transition-fast);
          text-align: left;
        }

        .chapter-step:hover {
          opacity: 0.9;
        }

        .chapter-step.active {
          opacity: 1;
        }

        .step-indicator {
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-secondary);
          transition: var(--transition-fast);
        }

        .chapter-step.active .step-dot {
          width: 10px;
          height: 10px;
          background: var(--accent-gold);
          box-shadow: 0 0 12px var(--accent-gold);
        }

        .step-meta {
          display: flex;
          flex-direction: column;
        }

        .step-num {
          font-size: 0.68rem;
          color: var(--accent-gold);
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .step-title {
          font-size: 0.82rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        /* Scroll Cue */
        .scroll-cue {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 10;
          pointer-events: none;
        }

        .cue-text {
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .mouse-icon {
          width: 20px;
          height: 32px;
          border: 1.5px solid rgba(223, 183, 117, 0.4);
          border-radius: 12px;
          position: relative;
        }

        .mouse-wheel {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 6px;
          background-color: var(--accent-gold);
          border-radius: 2px;
          animation: mouseScroll 1.8s infinite;
        }

        @keyframes mouseScroll {
          0% { transform: translate(-50%, 0); opacity: 1; }
          100% { transform: translate(-50%, 14px); opacity: 0; }
        }

        /* Progress Line */
        .scrolly-progress-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.08);
          z-index: 15;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #A67836, #DFB775);
          box-shadow: 0 0 10px rgba(223, 183, 117, 0.8);
          transition: width 0.05s linear;
        }

        @media (max-width: 992px) {
          .top-status-bar {
            padding: 0 20px;
            top: 76px;
          }
          .chapter-nav-rail {
            display: none;
          }
          .feature-cards-grid {
            grid-template-columns: 1fr;
            max-width: 420px;
            gap: 12px;
          }
          .feature-card {
            padding: 16px;
          }
          .flavor-bar-row {
            grid-template-columns: 130px 1fr 40px;
          }
        }

        @media (max-width: 640px) {
          .chip-label {
            display: none;
          }
          .hero-metrics-bar {
            gap: 16px;
            padding: 10px 18px;
          }
          .metric-val {
            font-size: 1.05rem;
          }
          .metric-lbl {
            font-size: 0.65rem;
          }
          .flavor-meter-card {
            padding: 18px 16px;
          }
          .flavor-bar-row {
            grid-template-columns: 100px 1fr 35px;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
}
