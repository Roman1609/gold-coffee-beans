'use client';

import React, { useState } from 'react';
import { COFFEE_PRODUCTS } from '../data/coffeeData';
import { CoffeeBeanIcon } from './icons/CoffeeBeanIcon';
import { MapPin, Flame, ArrowRight, Star } from 'lucide-react';

interface CatalogSectionProps {
  onOrderClick: (productId: string) => void;
}

export default function CatalogSection({ onOrderClick }: CatalogSectionProps) {
  const [filterRoast, setFilterRoast] = useState<'all' | 'light' | 'medium' | 'dark'>('all');

  const filteredProducts = COFFEE_PRODUCTS.filter(
    (p) => filterRoast === 'all' || p.roastLevel === filterRoast
  );

  return (
    <section className="section-wrapper bg-[#0B0806]" id="catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="section-head">
          <div className="section-badge">
            <CoffeeBeanIcon size={14} />
            <span>СВІЖИЙ ВРОЖАЙ 2026</span>
          </div>
          <h2 className="section-title">
            КАТАЛОГ <span className="text-gold-gradient">СОРТІВ КАВИ</span>
          </h2>
          <p className="section-subtitle">
            Оберіть сорт для дому, кав’ярні чи ресторану. Натисніть «Замовити», щоб оформити
            заявку на постачання через персонального менеджера.
          </p>

          {/* Roast Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            {[
              { id: 'all', label: 'Усі сорти' },
              { id: 'light', label: 'Світле / Фільтр' },
              { id: 'medium', label: 'Середнє / Omni' },
              { id: 'dark', label: 'Темне / Еспресо' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterRoast(tab.id as any)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  filterRoast === tab.id
                    ? 'bg-[#DFB775] text-[#0E0906] font-semibold shadow-md shadow-[#DFB775]/25'
                    : 'bg-[#1A120D]/60 text-[#C4B5A5] border border-[#DFB775]/15 hover:border-[#DFB775]/40 hover:text-[#FAF6F0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Minimalist Coffee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((coffee) => (
            <div
              key={coffee.id}
              className="glass-panel glass-panel-hover p-5 sm:p-6 flex flex-col justify-between"
            >
              <div>
                {/* Top Origin and SCA Score */}
                <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                  <span className="flex items-center gap-1.5 text-[#C4B5A5]">
                    <MapPin size={13} className="text-[#DFB775]" />
                    {coffee.origin} • {coffee.altitude}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#DFB775] bg-[#DFB775]/10 border border-[#DFB775]/25">
                    <Star size={11} className="fill-[#DFB775]" />
                    SCA {coffee.scaScore}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div className="mb-3">
                  <h3 className="font-sans font-semibold text-base sm:text-lg text-[#FAF6F0] mb-0.5">
                    {coffee.name.replace('AURA NOIR', 'GOLD')}
                  </h3>
                  <h4 className="font-serif text-sm sm:text-base text-[#F6DDB2] font-normal">
                    {coffee.tagline}
                  </h4>
                </div>

                {/* Roast & Variety Badges */}
                <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#C4B5A5] bg-white/5 px-2 py-0.5 rounded">
                    <Flame size={12} className="text-[#C98236]" />
                    {coffee.roastName.split('/')[0]}
                  </span>
                  <span className="text-[11px] text-[#DFB775] font-medium">
                    {coffee.variety}
                  </span>
                </div>

                {/* Flavor Notes */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {coffee.flavorNotes.map((note) => (
                    <span
                      key={note}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#DFB775]/8 border border-[#DFB775]/20 text-[#E2D7CC]"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#C4B5A5] leading-relaxed mb-5">
                  {coffee.description}
                </p>
              </div>

              {/* Bottom Action Row with Flex Wrap */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-baseline gap-1 whitespace-nowrap shrink-0">
                  <span className="text-[11px] sm:text-xs text-[#877667]">від</span>
                  <span className="font-serif font-bold text-base sm:text-lg md:text-xl text-[#DFB775]">
                    {coffee.priceBase} ₴
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#877667]">/ 250г</span>
                </div>

                <button
                  onClick={() => onOrderClick(coffee.id)}
                  className="btn-primary text-xs py-2 px-4 shadow-none hover:shadow-md w-full min-[440px]:w-auto justify-center"
                >
                  <span>Замовити</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
