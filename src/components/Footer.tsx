'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Send, MapPin, Phone, Clock, Check, AlertCircle } from 'lucide-react';
import { CoffeeBeanIcon } from './icons/CoffeeBeanIcon';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setIsSubscribed(true);
    } catch (err) {
      console.error('Помилка відправки підписки:', err);
      setIsSubscribed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative z-10 py-12 sm:py-16 md:py-20 bg-[#0B0705]/95 backdrop-blur-xl border-t border-[#DFB775]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="glass-panel p-6 sm:p-8 md:p-10 mb-10 sm:mb-14 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center bg-gradient-to-br from-[#1E150F]/90 to-[#120C08]/95 border-[#DFB775]/25">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold tracking-wider text-[#DFB775] mb-2 sm:mb-3">
              <CoffeeBeanIcon size={14} />
              <span>КЛУБ ПРИВІЛЕЇВ GOLD COFFEE BEANS</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#FAF6F0] mb-2 sm:mb-3 leading-snug">
              Отримайте <span className="text-gold-gradient">знижку 10%</span> на першу партію
            </h3>
            <p className="text-xs sm:text-sm text-[#C4B5A5] leading-relaxed max-w-xl">
              Дізнавайтеся першими про надходження лімітованих мікролотів Geisha, закриті каппінги
              та сезонні купажі свіжого врожаю.
            </p>
          </div>

          <div className="lg:col-span-5 w-full">
            {isSubscribed ? (
              <div className="flex flex-col gap-2.5 p-4 sm:p-5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[#E2D7CC] text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <Check size={20} className="text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-[#FAF6F0] block">Дякуємо за підписку!</strong>
                    <p className="text-xs text-[#C4B5A5]">Лист-підтвердження надіслано на <strong className="text-[#DFB775]">{email}</strong>.</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 text-amber-300 text-[11px] sm:text-xs flex items-start gap-2">
                  <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Якщо ви не бачите свого листа у поштовій скриньці перевірте у спамі, можливо він випадково потрапив туди.</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 w-full">
                <div className="flex-1 flex items-center gap-2.5 px-4 py-1.5 sm:py-2 bg-[#0E0906]/85 border border-[#DFB775]/20 focus-within:border-[#DFB775] rounded-full transition-colors">
                  <Mail size={16} className="text-[#877667] shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="Введіть ваш e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none text-[#FAF6F0] text-xs sm:text-sm outline-none py-1.5"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs shrink-0 whitespace-nowrap disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'Надсилаємо...' : 'Підписатися'}</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Info (Brand & Fictional Contacts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 pb-8 sm:pb-10 border-b border-white/5 mb-6">
          {/* Brand Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-8 h-8 rounded-full border border-[#DFB775]/40 bg-[#DFB775]/10 flex items-center justify-center text-[#DFB775]">
                <CoffeeBeanIcon size={16} />
              </div>
              <span className="font-serif font-bold text-base sm:text-lg text-[#FAF6F0] tracking-[0.04em]">
                GOLD COFFEE BEANS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#C4B5A5] leading-relaxed mb-5 max-w-md">
              Преміальне крафтове обсмаження кавових зерен класу Specialty. Відповідальний прямий
              імпорт, вивірені термопрофілі та філософія бездоганного смаку.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#DFB775] hover:text-[#DFB775] text-[#C4B5A5] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#DFB775] hover:text-[#DFB775] text-[#C4B5A5] flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send size={16} />
              </a>
            </div>
          </div>

          {/* Fictional / Demo Contact Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FAF6F0]">
                Ательє та Ростерія
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DFB775]/10 border border-[#DFB775]/25 text-[11px] text-[#DFB775] font-medium">
                <AlertCircle size={12} />
                <span>Тестові дані</span>
              </span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-[#C4B5A5]">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#DFB775] shrink-0 mt-0.5" />
                <span>м. Демо-Сіті, вул. Вигадана, 404 (Неіснуюча адреса)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#DFB775] shrink-0" />
                <span>+380 (00) 000-00-00 (Тестовий номер)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#DFB775] shrink-0" />
                <span>fictional-demo@goldcoffeebeans.example</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={15} className="text-[#DFB775] shrink-0" />
                <span>Пн–Нд: 00:00 – 24:00 (Цілодобовий демо-режим)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Demo Disclaimer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#877667] text-center sm:text-left pt-2">
          <p>© {new Date().getFullYear()} GOLD COFFEE BEANS Roastery Atelier.</p>
          <p className="text-[#C4B5A5] text-[11px] sm:text-xs">
            Даний сайт є демонстраційним зразком, він нічого не продає та не пропонує користувачам.
          </p>
        </div>
      </div>
    </footer>
  );
}
