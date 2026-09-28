'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall } from 'lucide-react';
import { CoffeeBeanIcon } from './icons/CoffeeBeanIcon';

interface HeaderProps {
  onContactClick: () => void;
}

export default function Header({ onContactClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'Про нас' },
    { href: '#catalog', label: 'Каталог сортів' },
    { href: '#philosophy', label: 'Обсмаження' },
    { href: '#reviews', label: 'Відгуки' },
    { href: '#contact', label: 'Постачання' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-[#0D0907]/90 backdrop-blur-xl border-b border-[#DFB775]/15 shadow-2xl shadow-black/80'
            : 'py-4 sm:py-5 bg-gradient-to-b from-[#0B0806]/85 via-[#0B0806]/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 md:gap-6">
          {/* Logo / Brand */}
          <a href="#" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group no-underline">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#DFB775]/10 border border-[#DFB775]/35 flex items-center justify-center text-[#DFB775] shadow-md shadow-[#DFB775]/15 group-hover:scale-105 transition-transform duration-200">
              <CoffeeBeanIcon size={15} />
            </div>
            <div className="flex flex-col">
              {/* Words made narrower with tracking-[0.02em] and tighter font styling */}
              <span className="font-serif font-bold text-sm sm:text-base lg:text-lg text-[#FAF6F0] leading-none tracking-[0.02em] whitespace-nowrap">
                GOLD COFFEE BEANS
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#DFB775] tracking-[0.14em] uppercase font-semibold mt-0.5">
                ARTISAN ROASTERY
              </span>
            </div>
          </a>

          {/* Desktop Navigation: proportionally scaled gaps between items, switches to burger at <= 900px */}
          <nav className="hidden min-[901px]:flex items-center gap-2.5 lg:gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs lg:text-sm font-medium text-[#C4B5A5] hover:text-[#DFB775] transition-colors duration-150 py-1 px-1 whitespace-nowrap no-underline"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Contact Button + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* CTA Button: Text on screens > 900px, Phone Icon only on <= 900px */}
            <button
              onClick={onContactClick}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DFB775] bg-gradient-to-r from-[#DFB775]/20 to-[#C4914A]/10 text-[#F6DDB2] hover:bg-[#DFB775] hover:text-[#0B0806] transition-all duration-200 cursor-pointer shadow-md shadow-[#DFB775]/10 hover:shadow-[#DFB775]/30 hover:-translate-y-0.5 px-0 w-8 h-8 min-[901px]:w-auto min-[901px]:h-auto min-[901px]:px-4 min-[901px]:py-2"
              aria-label="Зв'язатися з менеджером"
              title="Зв'язатися з менеджером"
            >
              <PhoneCall size={14} className="shrink-0" />
              <span className="hidden min-[901px]:inline text-xs font-semibold tracking-wide whitespace-nowrap">
                Зв&apos;язатися
              </span>
            </button>

            {/* Mobile Hamburger Toggle (visible on <= 900px) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="min-[901px]:hidden p-1.5 rounded-lg text-[#FAF6F0] hover:text-[#DFB775] hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Відкрити меню"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (visible on <= 900px) */}
      <div
        className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-sm min-[901px]:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 w-4/5 max-w-xs h-full bg-[#140E0A] border-l border-[#DFB775]/20 p-5 sm:p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            {/* Drawer Top Bar with explicit Close (X) button */}
            <div className="flex items-center justify-between pb-4 border-b border-[#DFB775]/20 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#DFB775]/10 border border-[#DFB775]/35 flex items-center justify-center text-[#DFB775]">
                  <CoffeeBeanIcon size={13} />
                </div>
                <span className="font-serif font-bold text-xs text-[#FAF6F0] tracking-[0.04em]">
                  GOLD COFFEE BEANS
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#C4B5A5] hover:text-[#DFB775] hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Закрити меню"
                title="Закрити меню"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-serif text-[#FAF6F0] hover:text-[#DFB775] transition-colors py-2 px-1 rounded-lg hover:bg-white/5 no-underline flex items-center justify-between group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <span className="text-[#DFB775] opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onContactClick();
              }}
              className="w-full btn-primary text-xs"
            >
              <PhoneCall size={14} />
              <span>Зв&apos;язатися з менеджером</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
