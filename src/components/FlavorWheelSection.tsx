'use client';

import React, { useState } from 'react';
import { COFFEE_PRODUCTS } from '../data/coffeeData';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CoffeeProduct } from '../types/coffee';

interface FlavorWheelSectionProps {
  onSelectCoffee: (product: CoffeeProduct) => void;
}

const FLAVOR_CATEGORIES = [
  {
    id: 'floral',
    name: 'Квіткові & Цитрусові',
    tagline: 'Витончені ефірні ноти білих квітів, жасмину та бергамоту',
    color: '#DFB775',
    accentBg: 'rgba(223, 183, 117, 0.12)',
    descriptors: ['Жасмин', 'Бергамот', 'Білий персик', 'Лайм', 'Квіти апельсина', 'Мед манука'],
    recommendedId: 'flora-geisha',
  },
  {
    id: 'berry',
    name: 'Ягідні & Соковиті',
    tagline: 'Яскрава винна кислотність, стигла чорниця та соковита смородина',
    color: '#D46A6A',
    accentBg: 'rgba(212, 106, 106, 0.12)',
    descriptors: ['Дика чорниця', 'Чорна смородина', 'Стигла ожина', 'Червоний грейпфрут'],
    recommendedId: 'ethiopia-yirgacheffe',
  },
  {
    id: 'chocolate',
    name: 'Шоколадні & Горіхові',
    tagline: 'Оксамитовий гіркий шоколад, смажений мигдаль та трюфель',
    color: '#A06D44',
    accentBg: 'rgba(160, 109, 68, 0.15)',
    descriptors: ['Темний шоколад 85%', 'Смажений пекан', 'Трюфель', 'Крем-брюле'],
    recommendedId: 'guatemala-obsidian',
  },
  {
    id: 'spicy',
    name: 'Карамельні & Пряні',
    tagline: 'Глибока солодкість молочної іриски, кленовий сироп та ваніль',
    color: '#DE9949',
    accentBg: 'rgba(222, 153, 73, 0.14)',
    descriptors: ['Жовта слива', 'Кленовий сироп', 'Молочна іриска', 'Інжир'],
    recommendedId: 'costa-rica-amber',
  },
];

export default function FlavorWheelSection({ onSelectCoffee }: FlavorWheelSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState('floral');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const activeCategory =
    FLAVOR_CATEGORIES.find((c) => c.id === activeCategoryId) || FLAVOR_CATEGORIES[0];
  const matchedCoffee =
    COFFEE_PRODUCTS.find((p) => p.id === activeCategory.recommendedId) || COFFEE_PRODUCTS[0];

  return (
    <section className="flavor-section" id="flavor-wheel">
      <div className="container">
        {/* Header */}
        <div className="section-head">
          <div className="head-badge">
            <Sparkles size={14} className="gold-icon" />
            <span>СЕНСОРНИЙ НАВІГАТОР</span>
          </div>
          <h2 className="section-title">
            КОЛЕСО СМАКОВИХ <span className="text-gold-gradient">ДЕЙСКТРИПТОРІВ</span>
          </h2>
          <p className="section-subtitle">
            Оберіть ноти, які ви найбільше любите у своїй ранковій чашці. Наш цифровий сомельє
            миттєво підбере ідеальний високогірний мікролот під ваші вподобання.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="flavor-layout">
          {/* Left Category Selection Cards */}
          <div className="flavor-categories-list">
            {FLAVOR_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setSelectedTag(null);
                  }}
                  className={`flavor-cat-card ${isActive ? 'active' : ''}`}
                >
                  <div className="cat-header">
                    <div
                      className="cat-color-indicator"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h3 className="cat-name">{cat.name}</h3>
                  </div>
                  <p className="cat-tagline">{cat.tagline}</p>

                  <div className="cat-tags">
                    {cat.descriptors.map((desc) => (
                      <span
                        key={desc}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCategoryId(cat.id);
                          setSelectedTag(desc);
                        }}
                        className={`descriptor-chip ${selectedTag === desc ? 'highlighted' : ''}`}
                      >
                        {desc}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Matching Result Card */}
          <div className="flavor-match-card glass-panel">
            <div className="match-banner">
              <div className="match-score-badge">
                <CheckCircle2 size={16} />
                <span>98.4% Смакова сумісність</span>
              </div>
              <span className="match-category-pill" style={{ color: activeCategory.color }}>
                {activeCategory.name}
              </span>
            </div>

            <div className="match-body">
              <span className="match-origin-badge">
                {matchedCoffee.origin} • {matchedCoffee.altitude}
              </span>
              <h3 className="match-title">{matchedCoffee.name}</h3>
              <h4 className="match-tagline">{matchedCoffee.tagline}</h4>

              <p className="match-desc">{matchedCoffee.description}</p>

              {/* Flavor Radar Breakdown */}
              <div className="flavor-breakdown">
                <div className="breakdown-item">
                  <span className="lbl">Кислинка:</span>
                  <div className="breakdown-bar">
                    <div
                      className="fill"
                      style={{
                        width: `${matchedCoffee.acidity * 20}%`,
                        backgroundColor: activeCategory.color,
                      }}
                    />
                  </div>
                </div>
                <div className="breakdown-item">
                  <span className="lbl">Солодкість:</span>
                  <div className="breakdown-bar">
                    <div
                      className="fill"
                      style={{
                        width: `${matchedCoffee.sweetness * 20}%`,
                        backgroundColor: activeCategory.color,
                      }}
                    />
                  </div>
                </div>
                <div className="breakdown-item">
                  <span className="lbl">Тіло:</span>
                  <div className="breakdown-bar">
                    <div
                      className="fill"
                      style={{
                        width: `${matchedCoffee.body * 20}%`,
                        backgroundColor: activeCategory.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Key Descriptors */}
              <div className="matched-notes">
                <span className="notes-label">Провідні ноти в чашці:</span>
                <div className="notes-row">
                  {matchedCoffee.flavorNotes.map((n) => (
                    <span key={n} className="note-pill">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="match-cta-row">
                <button
                  onClick={() => onSelectCoffee(matchedCoffee)}
                  className="btn-primary match-btn"
                >
                  <span>Переглянути цей сорт</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flavor-section {
          padding: 120px 0;
          background: transparent;
          position: relative;
          z-index: 1;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .section-head {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px;
        }

        .head-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(223, 183, 117, 0.1);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--accent-gold);
          margin-bottom: 20px;
        }

        .section-title {
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          line-height: 1.15;
          margin-bottom: 18px;
        }

        .section-subtitle {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .flavor-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 36px;
          align-items: center;
        }

        .flavor-categories-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .flavor-cat-card {
          padding: 22px 24px;
          background: rgba(26, 18, 13, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .flavor-cat-card:hover {
          background: rgba(38, 27, 20, 0.75);
          border-color: var(--border-accent);
          transform: translateX(4px);
        }

        .flavor-cat-card.active {
          background: rgba(42, 30, 22, 0.9);
          border-color: var(--accent-gold);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 3px 0 0 var(--accent-gold);
        }

        .cat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .cat-color-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .cat-name {
          font-size: 1.15rem;
          color: #FAF6F0;
          font-family: var(--font-serif);
        }

        .cat-tagline {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
          line-height: 1.45;
        }

        .cat-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .descriptor-chip {
          font-size: 0.73rem;
          padding: 3px 9px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }

        .descriptor-chip:hover {
          color: #FFFFFF;
          border-color: var(--accent-gold);
        }

        .descriptor-chip.highlighted {
          background: var(--accent-gold);
          color: #0B0806;
          font-weight: 600;
        }

        /* Match Card */
        .flavor-match-card {
          padding: 36px 32px;
          border-radius: var(--radius-lg);
          border-color: var(--border-accent);
          background: linear-gradient(135deg, rgba(28, 20, 14, 0.85) 0%, rgba(17, 12, 8, 0.95) 100%);
        }

        .match-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          margin-bottom: 24px;
        }

        .match-score-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #3B7A57;
          background: rgba(59, 122, 87, 0.15);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(59, 122, 87, 0.3);
        }

        .match-category-pill {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .match-origin-badge {
          font-size: 0.76rem;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          display: block;
          margin-bottom: 6px;
        }

        .match-title {
          font-size: 1.5rem;
          color: #FAF6F0;
          margin-bottom: 4px;
        }

        .match-tagline {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--accent-gold-light);
          margin-bottom: 16px;
        }

        .match-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .flavor-breakdown {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: rgba(14, 9, 6, 0.5);
          padding: 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 22px;
        }

        .breakdown-item {
          display: grid;
          grid-template-columns: 100px 1fr;
          align-items: center;
          gap: 12px;
        }

        .lbl {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .breakdown-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          overflow: hidden;
        }

        .fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.4s ease;
        }

        .matched-notes {
          margin-bottom: 28px;
        }

        .notes-label {
          font-size: 0.76rem;
          color: var(--text-muted);
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .notes-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .note-pill {
          padding: 4px 12px;
          background: rgba(223, 183, 117, 0.1);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          color: #FAF6F0;
        }

        .match-btn {
          width: 100%;
        }

        @media (max-width: 900px) {
          .flavor-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
