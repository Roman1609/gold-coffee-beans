'use client';

import React, { useState } from 'react';
import { CoffeeProduct, GrindType, WeightOption } from '../types/coffee';
import { ShoppingBag, Star, Check, Info, Flame, Droplets, MapPin, Mountain } from 'lucide-react';

interface CollectionSectionProps {
  products: CoffeeProduct[];
  onAddToCart: (product: CoffeeProduct, weight: WeightOption, grind: GrindType) => void;
  currency: 'UAH' | 'EUR' | 'USD';
}

const GRIND_LABELS: Record<GrindType, string> = {
  whole_bean: 'Цільне зерно',
  espresso: 'Дрібний (Еспресо)',
  filter_v60: 'Середній (Фільтр / V60)',
  french_press: 'Грубий (Френч-прес)',
  cezve: 'Ультратонкий (Турка)',
};

export default function CollectionSection({
  products,
  onAddToCart,
  currency,
}: CollectionSectionProps) {
  const [filterRoast, setFilterRoast] = useState<'all' | 'light' | 'medium' | 'dark'>('all');
  const [selectedProductDetails, setSelectedProductDetails] = useState<CoffeeProduct | null>(null);

  // Per-product user selections (weight and grind)
  const [productSelections, setProductSelections] = useState<
    Record<string, { weight: WeightOption; grind: GrindType; addedToast: boolean }>
  >({});

  const formatPrice = (uahAmount: number) => {
    if (currency === 'EUR') return `€${(uahAmount / 46).toFixed(1)}`;
    if (currency === 'USD') return `$${(uahAmount / 42).toFixed(1)}`;
    return `${uahAmount} ₴`;
  };

  const getProductSelection = (productId: string) => {
    return (
      productSelections[productId] || {
        weight: '250g',
        grind: 'whole_bean',
        addedToast: false,
      }
    );
  };

  const setWeight = (productId: string, weight: WeightOption) => {
    setProductSelections((prev) => ({
      ...prev,
      [productId]: {
        ...getProductSelection(productId),
        weight,
      },
    }));
  };

  const setGrind = (productId: string, grind: GrindType) => {
    setProductSelections((prev) => ({
      ...prev,
      [productId]: {
        ...getProductSelection(productId),
        grind,
      },
    }));
  };

  const handleAdd = (product: CoffeeProduct) => {
    const sel = getProductSelection(product.id);
    onAddToCart(product, sel.weight, sel.grind);

    // Trigger visual toast confirmation
    setProductSelections((prev) => ({
      ...prev,
      [product.id]: {
        ...sel,
        addedToast: true,
      },
    }));

    setTimeout(() => {
      setProductSelections((prev) => ({
        ...prev,
        [product.id]: {
          ...getProductSelection(product.id),
          addedToast: false,
        },
      }));
    }, 1800);
  };

  const filteredProducts = products.filter(
    (p) => filterRoast === 'all' || p.roastLevel === filterRoast
  );

  return (
    <section className="collection-section" id="collection">
      <div className="container">
        {/* Section Header */}
        <div className="section-head">
          <div className="head-badge">
            <span>АРХІВ СОРТІВ 2026</span>
          </div>
          <h2 className="section-title">
            КОЛЕКЦІЯ РІДКІСНИХ <span className="text-gold-gradient">МІКРОЛОТІВ</span>
          </h2>
          <p className="section-subtitle">
            Кожна партія обсмажується невеликими батчами до 12 кг під конкретне замовлення.
            Збереження живого профілю теруару та виняткової чистоти чашки.
          </p>

          {/* Roast Filter Tabs */}
          <div className="roast-filters">
            {[
              { id: 'all', label: 'Усі сорти' },
              { id: 'light', label: 'Світле / Фільтр & V60' },
              { id: 'medium', label: 'Середнє / Omni Roast' },
              { id: 'dark', label: 'Темне / Глибоке Еспресо' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterRoast(tab.id as any)}
                className={`filter-tab ${filterRoast === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const sel = getProductSelection(product.id);
            const currentPrice = product.weights[sel.weight];

            return (
              <div key={product.id} className="coffee-card glass-panel">
                {/* Visual Header / Bag Graphic & Badges */}
                <div className="card-media">
                  <div className="ambient-glow" />

                  {/* Packaging Visual Representation */}
                  <div className="bag-mockup">
                    <div className="bag-seal">
                      <span className="seal-text">AURORA</span>
                    </div>
                    <div className="bag-label-inner">
                      <span className="lot-code">{product.name.split(' ')[0]}</span>
                      <span className="lot-name">{product.tagline}</span>
                      <span className="lot-origin">{product.origin}</span>
                    </div>
                    <div className="bag-valve" title="Японський клапан дегазації" />
                  </div>

                  {/* Badges */}
                  <div className="media-badges">
                    {product.scaScore && (
                      <div className="badge-sca" title="Specialty Coffee Association Cupping Score">
                        <Star size={11} className="star-icon" />
                        <span>SCA {product.scaScore}</span>
                      </div>
                    )}
                    {product.isRare && <div className="badge-rare">Rare Lot</div>}
                  </div>

                  {/* Quick Detail Trigger */}
                  <button
                    onClick={() => setSelectedProductDetails(product)}
                    className="card-info-btn"
                    title="Повна інформація про ферму та обробку"
                  >
                    <Info size={16} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="card-body">
                  <div className="card-category-row">
                    <span className="card-variety">{product.variety}</span>
                    <span className="card-roast-tag">
                      <Flame size={12} />
                      {product.roastName.split('/')[0]}
                    </span>
                  </div>

                  <h3 className="card-title">{product.name}</h3>
                  <h4 className="card-tagline">{product.tagline}</h4>

                  {/* Terroir specs */}
                  <div className="terroir-specs">
                    <div className="spec-col">
                      <MapPin size={13} className="spec-icon" />
                      <span>{product.origin}, {product.region}</span>
                    </div>
                    <div className="spec-col">
                      <Mountain size={13} className="spec-icon" />
                      <span>{product.altitude}</span>
                    </div>
                  </div>

                  {/* Flavor Descriptors */}
                  <div className="flavor-notes-wrap">
                    {product.flavorNotes.map((note) => (
                      <span key={note} className="flavor-tag">
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Sensory Profile Bars */}
                  <div className="sensory-meters">
                    <div className="meter-item">
                      <span className="meter-lbl">Кислинка</span>
                      <div className="dots-row">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`dot ${i <= product.acidity ? 'filled' : ''}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="meter-item">
                      <span className="meter-lbl">Тіло</span>
                      <div className="dots-row">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`dot ${i <= product.body ? 'filled' : ''}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="meter-item">
                      <span className="meter-lbl">Солодкість</span>
                      <div className="dots-row">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`dot ${i <= product.sweetness ? 'filled' : ''}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Selectors: Weight & Grind */}
                  <div className="selector-group">
                    <div className="selector-label">Фасування:</div>
                    <div className="weight-chips">
                      {(['250g', '500g', '1000g'] as WeightOption[]).map((w) => (
                        <button
                          key={w}
                          onClick={() => setWeight(product.id, w)}
                          className={`weight-btn ${sel.weight === w ? 'active' : ''}`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="selector-group">
                    <div className="selector-label">Помел:</div>
                    <select
                      value={sel.grind}
                      onChange={(e) => setGrind(product.id, e.target.value as GrindType)}
                      className="grind-select"
                    >
                      {Object.entries(GRIND_LABELS).map(([k, label]) => (
                        <option key={k} value={k}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price & Purchase Action */}
                  <div className="card-footer-row">
                    <div className="price-box">
                      <span className="price-amount">{formatPrice(currentPrice)}</span>
                      <span className="price-weight">/ {sel.weight}</span>
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className={`btn-add-cart ${sel.addedToast ? 'added' : ''}`}
                    >
                      {sel.addedToast ? (
                        <>
                          <Check size={16} />
                          <span>У кошику</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          <span>Купити</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lot Details Modal */}
      {selectedProductDetails && (
        <div className="modal-backdrop" onClick={() => setSelectedProductDetails(null)}>
          <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-badge">Паспорт кавового зерна</span>
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <h3 className="modal-title">{selectedProductDetails.name}</h3>
            <p className="modal-subtitle">{selectedProductDetails.tagline}</p>

            <div className="modal-grid">
              <div className="modal-info-item">
                <span className="info-key">Країна / Регіон:</span>
                <span className="info-val">
                  {selectedProductDetails.origin} ({selectedProductDetails.region})
                </span>
              </div>
              <div className="modal-info-item">
                <span className="info-key">Ферма / Станція:</span>
                <span className="info-val">{selectedProductDetails.farm}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-key">Висота вирощування:</span>
                <span className="info-val">{selectedProductDetails.altitude}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-key">Метод обробки:</span>
                <span className="info-val">{selectedProductDetails.process}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-key">Різновид арабіки:</span>
                <span className="info-val">{selectedProductDetails.variety}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-key">Оцінка SCA (Cupping):</span>
                <span className="info-val text-gold">{selectedProductDetails.scaScore} / 100</span>
              </div>
            </div>

            <div className="modal-description">
              <h4>Про цей лот:</h4>
              <p>{selectedProductDetails.description}</p>
            </div>

            <div className="modal-brewing-rec">
              <h4>Рекомендовані способи екстракції:</h4>
              <div className="brew-tags">
                {selectedProductDetails.recommendedBrew.map((b) => (
                  <span key={b} className="brew-pill">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="modal-foot">
              <button
                onClick={() => {
                  handleAdd(selectedProductDetails);
                  setSelectedProductDetails(null);
                }}
                className="btn-primary full-width"
              >
                <ShoppingBag size={17} />
                <span>Додати до замовлення</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .collection-section {
          padding: 120px 0 100px;
          background: transparent;
          position: relative;
          z-index: 1;
        }

        .section-head {
          text-align: center;
          max-width: 820px;
          margin: 0 auto 60px;
        }

        .head-badge {
          display: inline-block;
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
          margin-bottom: 40px;
        }

        .roast-filters {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 10px 22px;
          background: rgba(26, 18, 13, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .filter-tab:hover {
          color: #FAF6F0;
          border-color: var(--accent-gold);
        }

        .filter-tab.active {
          background: var(--accent-gold);
          color: #0E0906;
          border-color: var(--accent-gold);
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(223, 183, 117, 0.35);
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .coffee-card {
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          background: rgba(22, 16, 11, 0.7);
        }

        .coffee-card:hover {
          transform: translateY(-6px);
          border-color: var(--border-accent);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(223, 183, 117, 0.12);
        }

        /* Card Media Area */
        .card-media {
          position: relative;
          height: 240px;
          background: linear-gradient(180deg, #1C130D 0%, #110B08 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-bottom: 1px solid var(--border-subtle);
        }

        .ambient-glow {
          position: absolute;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(223, 183, 117, 0.25) 0%, transparent 70%);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .bag-mockup {
          position: relative;
          width: 120px;
          height: 165px;
          background: linear-gradient(135deg, #2A1D15 0%, #150E0A 100%);
          border: 1px solid rgba(223, 183, 117, 0.35);
          border-radius: 8px 8px 12px 12px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 12px 8px;
        }

        .bag-seal {
          width: 70px;
          height: 8px;
          background: linear-gradient(90deg, #9C7034, #DFB775, #9C7034);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .seal-text {
          font-size: 0.45rem;
          color: #0E0906;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .bag-label-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 6px 4px;
          background: rgba(14, 9, 6, 0.85);
          border: 1px solid rgba(223, 183, 117, 0.2);
          border-radius: 4px;
          width: 90%;
        }

        .lot-code {
          font-size: 0.55rem;
          color: var(--accent-gold);
          letter-spacing: 0.12em;
          font-weight: 700;
        }

        .lot-name {
          font-size: 0.65rem;
          font-family: var(--font-serif);
          color: #FAF6F0;
          font-weight: 600;
          line-height: 1.2;
        }

        .lot-origin {
          font-size: 0.52rem;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .bag-valve {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1.5px solid rgba(223, 183, 117, 0.4);
          background: #110B08;
        }

        .media-badges {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .badge-sca {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(18, 13, 9, 0.85);
          border: 1px solid var(--accent-gold);
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--accent-gold);
        }

        .star-icon {
          color: var(--accent-gold);
          fill: var(--accent-gold);
        }

        .badge-rare {
          display: inline-flex;
          padding: 3px 8px;
          background: rgba(179, 84, 49, 0.85);
          border-radius: var(--radius-full);
          font-size: 0.68rem;
          font-weight: 600;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .card-info-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(26, 18, 13, 0.8);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .card-info-btn:hover {
          color: var(--accent-gold);
          border-color: var(--accent-gold);
        }

        /* Card Body */
        .card-body {
          padding: 24px 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-category-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.76rem;
          margin-bottom: 8px;
        }

        .card-variety {
          color: var(--accent-gold);
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .card-roast-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #FAF6F0;
          margin-bottom: 4px;
        }

        .card-tagline {
          font-size: 0.95rem;
          font-family: var(--font-serif);
          color: var(--text-secondary);
          font-weight: 400;
          margin-bottom: 14px;
        }

        .terroir-specs {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-bottom: 14px;
          margin-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .spec-col {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .spec-icon {
          color: var(--accent-gold);
        }

        .flavor-notes-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 18px;
        }

        .flavor-tag {
          padding: 4px 10px;
          background: rgba(223, 183, 117, 0.08);
          border: 1px solid rgba(223, 183, 117, 0.18);
          border-radius: var(--radius-full);
          font-size: 0.73rem;
          color: #E2D7CC;
        }

        /* Sensory Meters */
        .sensory-meters {
          display: flex;
          justify-content: space-between;
          background: rgba(14, 9, 6, 0.5);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          margin-bottom: 18px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .meter-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .meter-lbl {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .dots-row {
          display: flex;
          gap: 3px;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
        }

        .dot.filled {
          background: var(--accent-gold);
          box-shadow: 0 0 6px var(--accent-gold);
        }

        /* Selectors */
        .selector-group {
          margin-bottom: 14px;
        }

        .selector-label {
          font-size: 0.74rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .weight-chips {
          display: flex;
          gap: 8px;
        }

        .weight-btn {
          flex: 1;
          padding: 6px 0;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .weight-btn.active {
          background: rgba(223, 183, 117, 0.18);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          font-weight: 600;
        }

        .grind-select {
          width: 100%;
          padding: 8px 12px;
          background: rgba(14, 9, 6, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-size: 0.82rem;
          outline: none;
          cursor: pointer;
        }

        .grind-select option {
          background: #18110D;
          color: #FAF6F0;
        }

        /* Footer Row */
        .card-footer-row {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .price-box {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .price-amount {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--accent-gold);
          font-family: var(--font-serif);
        }

        .price-weight {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .btn-add-cart {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #DFB775 0%, #C4914A 100%);
          color: #0E0906;
          border: none;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-add-cart:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(223, 183, 117, 0.4);
        }

        .btn-add-cart.added {
          background: #3B7A57;
          color: #FFFFFF;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          max-width: 620px;
          width: 100%;
          background: #18110D;
          border: 1px solid var(--border-accent);
          padding: 32px;
          border-radius: var(--radius-lg);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .modal-badge {
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent-gold);
        }

        .modal-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.2rem;
          cursor: pointer;
        }

        .modal-title {
          font-size: 1.8rem;
          margin-bottom: 4px;
        }

        .modal-subtitle {
          font-family: var(--font-serif);
          color: var(--accent-gold);
          font-size: 1.1rem;
          margin-bottom: 24px;
        }

        .modal-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          background: rgba(10, 7, 5, 0.5);
          padding: 18px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .modal-info-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .info-key {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .info-val {
          font-size: 0.88rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .text-gold {
          color: var(--accent-gold);
          font-weight: 700;
        }

        .modal-description {
          margin-bottom: 22px;
        }

        .modal-description h4,
        .modal-brewing-rec h4 {
          font-size: 0.92rem;
          color: #FAF6F0;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .modal-description p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.92rem;
        }

        .brew-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
        }

        .brew-pill {
          padding: 6px 14px;
          background: rgba(223, 183, 117, 0.12);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          color: var(--accent-gold);
        }

        .full-width {
          width: 100%;
        }

        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          .modal-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
