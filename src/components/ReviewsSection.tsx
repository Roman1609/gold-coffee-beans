'use client';

import React from 'react';
import { SOMMELIER_REVIEWS } from '../data/coffeeData';
import { Star, Quote, Award, CheckCircle } from 'lucide-react';
import { CoffeeBeanIcon } from './icons/CoffeeBeanIcon';

export default function ReviewsSection() {
  return (
    <section className="section-wrapper bg-[#0B0806]" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-head">
          <div className="section-badge">
            <CoffeeBeanIcon size={14} />
            <span>ВЕРДИКТ ЕКСПЕРТІВ</span>
          </div>
          <h2 className="section-title">
            ОЦІНКА Q-ГРЕЙДЕРІВ <br />
            <span className="text-gold-gradient">ТА ВІДГУКИ БАРИСТА</span>
          </h2>
          <p className="section-subtitle">
            Професійний сенсорний аналіз від сертифікованих суддів кавових чемпіонатів
            та відгуки поціновувачів чистого смаку.
          </p>

          {/* Aggregate Rating Banner */}
          <div className="inline-flex items-center gap-2 sm:gap-3 py-2 px-4 sm:px-6 rounded-full bg-[#1A120D]/80 border border-[#DFB775]/25 mt-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className="text-[#DFB775] fill-[#DFB775]" />
              ))}
            </div>
            <span className="font-bold text-xs sm:text-sm text-[#FAF6F0]">4.96 з 5.0</span>
            <span className="text-xs text-[#877667] hidden sm:inline">• понад 1,450 оцінених чашок</span>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {SOMMELIER_REVIEWS.map((rev) => (
            <div key={rev.id} className="glass-panel glass-panel-hover p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <Quote size={24} className="text-[#DFB775]/40 mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm text-[#E2D7CC] leading-relaxed mb-4">
                  {rev.text}
                </p>
                <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#DFB775]/10 border border-[#DFB775]/20 text-[11px] text-[#DFB775] mb-5">
                  <Award size={12} />
                  <span>Оцінений лот: {rev.product}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3.5 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DFB775] to-[#A67836] flex items-center justify-center font-bold text-[#0E0906] text-base shrink-0">
                  {rev.author[0]}
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-xs sm:text-sm text-[#FAF6F0] mb-0.5">
                    {rev.author}
                  </h4>
                  <p className="text-[11px] text-[#877667] leading-snug">
                    {rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guild Badges Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-4 sm:py-5 px-6 rounded-2xl bg-[#0E0906]/60 border border-[#DFB775]/15 text-xs text-[#C4B5A5]">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-[#DFB775]" />
            <span>Сертифіковано SCA Ukraine</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-[#DFB775]" />
            <span>Член Гільдії Крафтових Ростерів</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-[#DFB775]" />
            <span>100% Відстежуваність (Single Origin)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
