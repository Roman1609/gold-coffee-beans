'use client';

import React, { useRef } from 'react';
import { Compass, ChevronDown, ShieldCheck, Award, Flame, PhoneCall } from 'lucide-react';
import { CoffeeBeanIcon } from './icons/CoffeeBeanIcon';

interface HeroSectionProps {
  onExploreClick: () => void;
  onContactClick: () => void;
}

export default function HeroSection({ onExploreClick, onContactClick }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-36 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0B0806]" id="hero">
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="/video/Hand_pouring_coffee_beans_into_20260927124630.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover block"
        />
        {/* Contrast Vignette Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,8,6,0.45)_0%,rgba(11,8,6,0.8)_75%,rgba(11,8,6,0.96)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0806]/85 via-[#0B0806]/35 to-[#0B0806]/95" />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center text-center">
        {/* Main Hero Header */}
        <div className="flex flex-col items-center max-w-3xl mb-8 sm:mb-12">
          <div className="section-badge">
            <CoffeeBeanIcon size={14} />
            <span>SPECIALTY ROASTERY • CROP 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal leading-[1.15] text-[#FAF6F0] mb-4 sm:mb-6 drop-shadow-md">
            GOLD COFFEE BEANS <br />
            <span className="text-gold-gradient">МИСТЕЦТВО ДОСКОНАЛОГО ЗЕРНА</span>
          </h1>

          <p className="text-[#E2D7CC] text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mb-3 drop-shadow">
            Високогірні мікролоти арабіки з вулканічних схилів. Ручний відбір стиглих ягід,
            повільне обсмаження на чавунному ростері та гарантоване постачання в піку свіжості.
          </p>

          <p className="text-[#DFB775]/90 text-[11px] sm:text-xs tracking-wide max-w-xl mb-6 sm:mb-8 drop-shadow font-medium">
            Даний сайт є демонстраційним зразком, він нічого не продає та не пропонує користувачам.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button onClick={onExploreClick} className="btn-primary">
              <Compass size={16} />
              <span>Каталог сортів</span>
            </button>
            <button onClick={onContactClick} className="btn-secondary">
              <PhoneCall size={15} />
              <span>Зв&apos;язатися з менеджером</span>
            </button>
          </div>

          {/* Terroir Metrics Bar */}
          <div className="glass-panel py-2 px-5 sm:px-8 flex items-center gap-4 sm:gap-8 rounded-full shadow-lg">
            <div className="flex flex-col items-center">
              <span className="font-serif font-bold text-base sm:text-lg text-[#DFB775]">2,150м</span>
              <span className="text-[10px] sm:text-xs text-[#C4B5A5] uppercase tracking-wider">Висота</span>
            </div>
            <div className="w-px h-6 bg-[#DFB775]/25" />
            <div className="flex flex-col items-center">
              <span className="font-serif font-bold text-base sm:text-lg text-[#DFB775]">88.5+</span>
              <span className="text-[10px] sm:text-xs text-[#C4B5A5] uppercase tracking-wider">SCA Score</span>
            </div>
            <div className="w-px h-6 bg-[#DFB775]/25" />
            <div className="flex flex-col items-center">
              <span className="font-serif font-bold text-base sm:text-lg text-[#DFB775]">48 год</span>
              <span className="text-[10px] sm:text-xs text-[#C4B5A5] uppercase tracking-wider">Свіжість</span>
            </div>
          </div>
        </div>

        {/* 3 Story Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 w-full mb-8 sm:mb-10 text-left">
          <div className="glass-panel glass-panel-hover p-4 sm:p-6">
            <div className="w-10 h-10 rounded-xl bg-[#DFB775]/10 border border-[#DFB775]/25 flex items-center justify-center text-[#DFB775] mb-3">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold text-[#DFB775] tracking-widest uppercase block mb-1">01. ВІДБІР</span>
            <h3 className="font-serif text-base sm:text-lg text-[#FAF6F0] mb-1.5">Ручне сортування 22° Brix</h3>
            <p className="text-[#C4B5A5] text-xs sm:text-sm leading-relaxed">
              Відкидаємо до 40% зерен на етапі калібрування. Тільки ідеально стиглі ягоди з природною цукристістю.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-4 sm:p-6">
            <div className="w-10 h-10 rounded-xl bg-[#DFB775]/10 border border-[#DFB775]/25 flex items-center justify-center text-[#DFB775] mb-3">
              <Flame size={20} />
            </div>
            <span className="text-[10px] font-bold text-[#DFB775] tracking-widest uppercase block mb-1">02. ОБСМАЖЕННЯ</span>
            <h3 className="font-serif text-base sm:text-lg text-[#FAF6F0] mb-1.5">Чавунний ростер Giesen</h3>
            <p className="text-[#C4B5A5] text-xs sm:text-sm leading-relaxed">
              Плавна карамелізація натуральних фруктових цукрів з точністю до 0.1°C без гіркоти чи пересмаження.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-4 sm:p-6">
            <div className="w-10 h-10 rounded-xl bg-[#DFB775]/10 border border-[#DFB775]/25 flex items-center justify-center text-[#DFB775] mb-3">
              <Award size={20} />
            </div>
            <span className="text-[10px] font-bold text-[#DFB775] tracking-widest uppercase block mb-1">03. СВІЖІСТЬ</span>
            <h3 className="font-serif text-base sm:text-lg text-[#FAF6F0] mb-1.5">Клапан AromaLock™</h3>
            <p className="text-[#C4B5A5] text-xs sm:text-sm leading-relaxed">
              Запечатано в багатошарові пакети з одностороннім клапаном відразу після купінгу для збереження аромату.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-1.5 text-[#877667] text-[11px] uppercase tracking-widest">
          <span>Гортайте для перегляду каталогу</span>
          <ChevronDown size={16} className="text-[#DFB775] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
